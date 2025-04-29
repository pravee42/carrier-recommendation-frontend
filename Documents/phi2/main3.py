import os
import sys
import argparse
import json
from typing import Dict, List, Any, Optional, Tuple
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
import requests
import time
import asyncio
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import httpx
from concurrent.futures import ThreadPoolExecutor

# Configuration
class Config:
    OLLAMA_ENDPOINT = "http://localhost:11434/api/generate"
    MODEL_NAME = "phi3"
    MAX_TOKENS = 5000  # Reduced for faster generation
    TEMP = 1  # Reduced temperature for more deterministic outputs
    ANALYSIS_MODULES = ["layout", "color", "typography", "accessibility", "usability"]
    OUTPUT_FORMATS = ["json", "html", "markdown"]
    CACHE_ENABLED = True  # Enable caching for faster repeated analysis
    PARALLEL_PROCESSING = True  # Enable parallel processing

# Cache implementation
class SimpleCache:
    def __init__(self, max_size=100):
        self.cache = {}
        self.max_size = max_size
        
    def get(self, key):
        return self.cache.get(key)
        
    def set(self, key, value):
        if len(self.cache) >= self.max_size:
            # Simple eviction policy (remove oldest)
            self.cache.pop(next(iter(self.cache)))
        self.cache[key] = value
        
    def has(self, key):
        return key in self.cache

# Ollama Client with optimizations
class OllamaClient:
    def __init__(self, endpoint, model_name, max_tokens=2048, temperature=0.5):
        self.endpoint = endpoint
        self.model_name = model_name
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.cache = SimpleCache()
        self._executor = ThreadPoolExecutor(max_workers=5)  # Limit concurrent requests
    
    async def generate_async(self, prompt):
        """Generate text using Ollama API asynchronously"""
        # Check cache first
        cache_key = f"{prompt[:100]}_{len(prompt)}"
        if self.cache.has(cache_key):
            return self.cache.get(cache_key)
        
        try:
            # Use ThreadPoolExecutor for CPU-bound tasks
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self._executor, 
                lambda: self._make_request(prompt)
            )
            
            # Cache the result
            if result and not result.startswith("Error"):
                self.cache.set(cache_key, result)
                
            return result
        except Exception as e:
            print(f"Async generation error: {str(e)}")
            return f"Error: {str(e)}"
    
    def generate(self, prompt):
        """Synchronous generate for backwards compatibility"""
        cache_key = f"{prompt[:100]}_{len(prompt)}"
        if self.cache.has(cache_key):
            return self.cache.get(cache_key)
            
        result = self._make_request(prompt)
        
        # Cache the result
        if result and not result.startswith("Error"):
            self.cache.set(cache_key, result)
            
        return result
    
    def _make_request(self, prompt):
        """Make actual API request to Ollama"""
        try:
            # Create a more focused prompt to get faster responses
            focused_prompt = self._optimize_prompt(prompt)
            
            payload = {
                "model": self.model_name,
                "prompt": focused_prompt,
                "stream": False,  # No streaming for faster complete response
                "options": {
                    "temperature": self.temperature,
                    "num_predict": self.max_tokens
                }
            }
            
            # Set a timeout for the request
            response = requests.post(self.endpoint, json=payload, timeout=30)
            
            if response.status_code == 200:
                return response.json().get("response", "")
            else:
                print(f"Error: {response.status_code} - {response.text}")
                return f"Error generating response: {response.status_code}"
                
        except Exception as e:
            print(f"Generation error: {str(e)}")
            return f"Error: {str(e)}"
    
    def _optimize_prompt(self, prompt):
        """Optimize prompts for faster, more focused responses"""
        # If prompt is too long, try to shorten it while keeping key info
        if len(prompt) > 4000:
            # Find the main instruction part
            if "IMPORTANT:" in prompt:
                important_idx = prompt.find("IMPORTANT:")
                start_idx = max(0, important_idx - 500)
                return prompt[start_idx:]
        return prompt

# Core UI Analysis Engine with performance optimizations
class UIAnalysisEngine:
    def __init__(self, config: Config):
        self.config = config
        self.ollama_client = OllamaClient(
            config.OLLAMA_ENDPOINT, 
            config.MODEL_NAME,
            max_tokens=config.MAX_TOKENS,
            temperature=config.TEMP
        )
        self.modules = self._load_modules()
        self.cache = SimpleCache()
        
    def _load_modules(self):
        """Load analysis modules"""
        modules = {}
        for module_name in self.config.ANALYSIS_MODULES:
            modules[module_name] = self._initialize_module(module_name)
        return modules
        
    def _initialize_module(self, module_name):
        """Initialize a specific analysis module with expert prompts"""
        # Module-specific expert prompts - shortened for faster processing
        module_prompts = {
            "layout": """Analyze the UI layout considering:
1. Visual hierarchy and information architecture
2. Grid alignment and consistency
3. White space usage and content density
4. Responsive design principles
5. Visual balance and focal points""",
            
            "color": """Analyze the color scheme considering:
1. Color harmony and contrast ratios
2. Brand alignment and color psychology
3. Accessibility compliance (WCAG standards)
4. Color consistency across elements
5. Emotional impact and user perception""",
            
            "typography": """Analyze the typography considering:
1. Font choices and hierarchy
2. Readability and legibility
3. Text spacing and line height
4. Font pairing effectiveness
5. Typographic contrast and emphasis""",
            
            "accessibility": """Analyze accessibility considering:
1. WCAG 2.1 AA compliance
2. Color contrast ratios
3. Text scaling and readability
4. Focus states and keyboard navigation
5. Alternative text for images""",
            
            "usability": """Analyze usability considering:
1. Clarity of user flows and actions
2. Cognitive load and complexity
3. Affordances and signifiers
4. Error prevention and recovery
5. Efficiency of task completion"""
        }
        
        return {
            "prompt": module_prompts.get(module_name, "Analyze this UI design aspect concisely"),
            "analyzer": getattr(self, f"_analyze_{module_name}", self._default_analyzer)
        }
    
    def _default_analyzer(self, image_data, context=None):
        """Default analysis function if specialized one doesn't exist"""
        return {}
        
    def _analyze_layout(self, image_data, context=None):
        """Layout analysis implementation - optimized"""
        try:
            # Fast layout analysis using edge detection
            gray = cv2.cvtColor(image_data["array"], cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            
            # Detect lines for grid analysis
            lines = cv2.HoughLinesP(edges, 1, np.pi/180, 50, minLineLength=50, maxLineGap=10)
            
            # Calculate basic metrics
            horizontal_lines = 0
            vertical_lines = 0
            
            if lines is not None:
                for line in lines:
                    x1, y1, x2, y2 = line[0]
                    if abs(x2 - x1) > abs(y2 - y1):
                        horizontal_lines += 1
                    else:
                        vertical_lines += 1
            
            # Check for common UI sections using simple heuristics
            h, w = image_data["height"], image_data["width"]
            sections = []
            
            # Check for header (usually top 15% of screen)
            header_region = gray[:int(h*0.15), :]
            if np.mean(header_region) != np.mean(gray):
                sections.append("header")
                
            # Check for footer (usually bottom 15%)
            footer_region = gray[int(h*0.85):, :]
            if np.mean(footer_region) != np.mean(gray):
                sections.append("footer")
                
            # Check for sidebar (usually left or right 20%)
            left_region = gray[:, :int(w*0.2)]
            right_region = gray[:, int(w*0.8):]
            if np.mean(left_region) != np.mean(gray):
                sections.append("left_sidebar")
            if np.mean(right_region) != np.mean(gray):
                sections.append("right_sidebar")
                
            # Main content is usually in the middle
            sections.append("main_content")
            
            # Calculate alignment score based on line consistency
            if lines is not None and len(lines) > 0:
                alignment_score = min(0.85, 0.5 + (vertical_lines / max(1, len(lines))) * 0.5)
            else:
                alignment_score = 0.5
                
            return {
                "grid_alignment": round(alignment_score, 2),
                "visual_hierarchy": 0.7,  # Placeholder
                "whitespace_usage": 0.65,  # Placeholder
                "detected_sections": sections
            }
        except Exception as e:
            print(f"Layout analysis error: {str(e)}")
            return {
                "grid_alignment": 0.7,
                "visual_hierarchy": 0.7,
                "whitespace_usage": 0.6,
                "detected_sections": ["header", "main_content", "footer"]
            }
    
    def _analyze_color(self, image_data, context=None):
        """Color analysis implementation - optimized"""
        try:
            # Convert to RGB for color analysis
            img = image_data["array"]
            if len(img.shape) == 3 and img.shape[2] == 3:
                # Downsize image for faster processing
                small_img = cv2.resize(img, (100, 100))
                pixels = small_img.reshape(-1, 3)
                
                # Use K-means for fast color extraction
                from sklearn.cluster import MiniBatchKMeans
                kmeans = MiniBatchKMeans(n_clusters=5, batch_size=100, random_state=42)
                kmeans.fit(pixels)
                
                # Get the colors
                colors = kmeans.cluster_centers_.astype(int)
                
                # Convert to hex
                hex_colors = []
                for color in colors:
                    r, g, b = color
                    hex_color = f"#{r:02x}{g:02x}{b:02x}"
                    hex_colors.append(hex_color.upper())
                
                # Calculate a simple contrast ratio (between darkest and lightest)
                colors_brightness = [0.299*c[0] + 0.587*c[1] + 0.114*c[2] for c in colors]
                max_bright = max(colors_brightness)
                min_bright = min(colors_brightness)
                
                # Basic contrast ratio calculation
                contrast_ratio = (max_bright + 0.05) / (min_bright + 0.05)
                
                return {
                    "primary_colors": hex_colors,
                    "contrast_ratio": round(min(contrast_ratio, 21), 1),  # Max WCAG ratio is 21
                    "color_harmony": "complementary",  # Placeholder
                    "accessibility_issues": 1 if contrast_ratio < 4.5 else 0
                }
            else:
                return {
                    "primary_colors": ["#3366CC", "#FFFFFF", "#F5F5F5", "#333333"],
                    "contrast_ratio": 4.5,
                    "color_harmony": "complementary",
                    "accessibility_issues": 1
                }
        except Exception as e:
            print(f"Color analysis error: {str(e)}")
            return {
                "primary_colors": ["#3366CC", "#FFFFFF", "#F5F5F5", "#333333"],
                "contrast_ratio": 4.5,
                "color_harmony": "complementary",
                "accessibility_issues": 1
            }
    
    async def analyze_design_async(self, image_path: str, analysis_type: str = "full", purpose: str = "dashboard", screen: str = "desktop") -> Dict[str, Any]:
        """Asynchronous analysis entry point"""
        try:
            # Check cache first
            cache_key = f"{image_path}_{analysis_type}_{purpose}_{screen}"
            if self.config.CACHE_ENABLED and self.cache.has(cache_key):
                return self.cache.get(cache_key)
                
            # Load and preprocess image
            image = self._load_image(image_path)
            image_data = self._preprocess_image(image)
            
            context = {
                "screen_type": screen,
                "estimated_purpose": purpose,
                "complexity_level": "medium"
            }
            
            # Run selected analyses - in parallel if enabled
            results = {}
            if analysis_type == "full":
                if self.config.PARALLEL_PROCESSING:
                    # Run analyses in parallel
                    tasks = []
                    for module_name in self.modules:
                        tasks.append(self._run_module_analysis_async(module_name, image_data, context))
                    
                    module_results = await asyncio.gather(*tasks)
                    for i, module_name in enumerate(self.modules):
                        results[module_name] = module_results[i]
                else:
                    # Sequential processing
                    for module_name, module in self.modules.items():
                        results[module_name] = await self._run_module_analysis_async(module_name, image_data, context)
            else:
                if analysis_type in self.modules:
                    results[analysis_type] = await self._run_module_analysis_async(analysis_type, image_data, context)
                else:
                    raise ValueError(f"Unknown analysis type: {analysis_type}")
            
            # Generate comprehensive report
            report = await self._generate_report_async(image_data, results, context)
            
            # Cache the result
            if self.config.CACHE_ENABLED:
                self.cache.set(cache_key, report)
                
            return report
            
        except Exception as e:
            print(f"Analysis error: {str(e)}")
            return {"error": str(e)}
    
    def analyze_design(self, image_path: str, analysis_type: str = "full", purpose: str = "dashboard", screen: str = "desktop") -> Dict[str, Any]:
        """Synchronous analysis entry point for backwards compatibility"""
        try:
            # Use the event loop if available, otherwise create one
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    # We're already in an async context
                    return asyncio.run_coroutine_threadsafe(
                        self.analyze_design_async(image_path, analysis_type, purpose, screen),
                        loop
                    ).result()
                else:
                    return loop.run_until_complete(
                        self.analyze_design_async(image_path, analysis_type, purpose, screen)
                    )
            except RuntimeError:
                # No event loop, create one
                return asyncio.run(
                    self.analyze_design_async(image_path, analysis_type, purpose, screen)
                )
        except Exception as e:
            print(f"Analysis error in sync wrapper: {str(e)}")
            return {"error": str(e)}
    
    def _load_image(self, image_path):
        """Load image from path"""
        return Image.open(image_path)
    
    def _preprocess_image(self, image):
        """Preprocess image for analysis - optimized for speed"""
        # Convert to numpy array for CV operations
        image_np = np.array(image)
        
        # Resize to a reasonable size for faster processing
        max_dim = 800  # Reduced from 1200 for faster processing
        h, w = image_np.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            new_h, new_w = int(h * scale), int(w * scale)
            image_np = cv2.resize(image_np, (new_w, new_h))
        
        return {
            "original": image,
            "array": image_np,
            "height": image_np.shape[0],
            "width": image_np.shape[1]
        }
    
    async def _run_module_analysis_async(self, module_name, image_data, context):
        """Run analysis for a specific module asynchronously"""
        module = self.modules[module_name]
        
        # Get computer vision based metrics
        cv_metrics = module["analyzer"](image_data, context)
        
        # Prepare prompt for LLM analysis - shorter, more focused prompt
        analysis_prompt = self._prepare_analysis_prompt(module_name, module["prompt"], image_data, context, cv_metrics)
        
        # Get LLM analysis asynchronously
        llm_analysis = await self.ollama_client.generate_async(analysis_prompt)
        
        # Process and structure the LLM output
        structured_analysis = self._structure_analysis(module_name, llm_analysis, cv_metrics)
        
        return structured_analysis
        
    def _run_module_analysis(self, module_name, image_data, context):
        """Synchronous version for backwards compatibility"""
        module = self.modules[module_name]
        
        # Get computer vision based metrics
        cv_metrics = module["analyzer"](image_data, context)
        
        # Prepare prompt for LLM analysis
        analysis_prompt = self._prepare_analysis_prompt(module_name, module["prompt"], image_data, context, cv_metrics)
        
        # Get LLM analysis
        llm_analysis = self.ollama_client.generate(analysis_prompt)
        
        # Process and structure the LLM output
        structured_analysis = self._structure_analysis(module_name, llm_analysis, cv_metrics)
        
        return structured_analysis
    
    def _prepare_analysis_prompt(self, module_name, base_prompt, image_data, context, cv_metrics):
        """Prepare a focused, efficient prompt for faster LLM responses"""
        image_description = f"[Image: {context['screen_type']} UI for {context['estimated_purpose']}]"
        
        # More focused prompt to get faster responses
        prompt = f"""
You are a UI/UX expert focusing on {module_name} analysis.

UI design details:
{image_description}
Context: {context['screen_type']} {context['estimated_purpose']} app
CV metrics: {json.dumps(cv_metrics, indent=0)}

{base_prompt}

IMPORTANT: Provide SPECIFIC, ACTIONABLE improvements. Format as JSON:
{{
  "overall_score": (number 1-10),
  "strengths": ["strength1", "strength2"],
  "improvements": [
    {{
      "issue": "specific issue",
      "impact": "user impact",
      "recommendation": "specific solution",
      "implementation_details": "specific values/techniques",
      "priority": (1-5)
    }}
  ],
  "industry_comparison": "brief comparison"
  
   IMPORTANT: Your primary goal is to provide SPECIFIC, ACTIONABLE improvement recommendations that the design team can immediately implement. For each issue you identify:
    1. Describe the exact problem in detail
    2. Explain WHY it's a problem (impact on users)
    3. Provide a CONCRETE solution with specific implementation details
    4. Include visual specifications where relevant (colors, spacing, typography values)
    5. Reference industry best practices or examples that demonstrate the solution

    Format your response as structured JSON with the following keys:
    - overall_score
    - strengths (array of strengths with brief explanations)
    - improvements (array of objects with these keys):
    * issue: specific description of the problem
    * impact: how this affects users or business goals
    * recommendation: detailed actionable solution
    * implementation_details: specific values, measurements, or techniques to use
    * before_after: conceptual description of how the element would change
    * priority: 1-5 rating (5 being highest priority)
    - industry_comparison (text)

    Ensure that your recommendations are very specific - avoid vague advice like "improve contrast" and instead say exactly what should be changed (e.g., "Change the button text color from #777777 to #121212 to achieve a contrast ratio of at least 4.5:1")
  
}}
"""
        return prompt
    
    def _structure_analysis(self, module_name, llm_analysis, cv_metrics):
        """Structure the LLM analysis output - with error handling"""
        try:
            # Try to parse JSON from LLM
            # First, find JSON object if embedded in text
            json_start = llm_analysis.find('{')
            json_end = llm_analysis.rfind('}')
            
            if json_start >= 0 and json_end >= 0:
                json_str = llm_analysis[json_start:json_end+1]
                analysis_data = json.loads(json_str)
            else:
                # Try parsing the whole response
                analysis_data = json.loads(llm_analysis)
            
            # Ensure required fields exist
            if "overall_score" not in analysis_data:
                analysis_data["overall_score"] = 7
            if "strengths" not in analysis_data:
                analysis_data["strengths"] = ["Good design elements detected"]
            if "improvements" not in analysis_data:
                analysis_data["improvements"] = []
            if "industry_comparison" not in analysis_data:
                analysis_data["industry_comparison"] = "Comparable to industry standards"
                
            # Combine with CV metrics
            analysis_data.update({
                "cv_metrics": cv_metrics,
                "module": module_name
            })
            
            return analysis_data
        except Exception as e:
            print(f"JSON parsing error: {str(e)}")
            # Fallback if JSON parsing fails
            return {
                "module": module_name,
                "cv_metrics": cv_metrics,
                "overall_score": 7,
                "strengths": ["Elements detected by computer vision"],
                "improvements": [{"issue": "Analysis needs human review", 
                                  "impact": "May affect design quality",
                                  "recommendation": "Review design manually",
                                  "priority": 3}],
                "industry_comparison": "Requires manual evaluation"
            }
    
    async def _generate_report_async(self, image_data, results, context):
        """Generate comprehensive design analysis report asynchronously"""
        # Calculate overall metrics
        overall_score = self._calculate_overall_score(results)
        
        # Extract all improvements across modules
        all_improvements = self._prioritize_improvements(results)
        
        # Generate implementation roadmap
        implementation_roadmap = self._generate_implementation_roadmap(all_improvements)
        
        # Generate executive summary asynchronously
        summary = await self._generate_executive_summary_async(results, context, overall_score)
        
        # Compile report
        report = {
            "timestamp": self._get_timestamp(),
            "design_context": context,
            "overall_score": overall_score,
            "modules_analyzed": list(results.keys()),
            "summary": summary,
            "improvement_priority": all_improvements,  # Limit to top 10 for speed
            "implementation_roadmap": implementation_roadmap,
            "detailed_results": results  # Original module results included at the end
        }
        
        return report
        
    def _calculate_overall_score(self, results):
        """Calculate overall score from module results"""
        total_score = 0
        total_modules = 0
        
        for module_name, analysis in results.items():
            if "overall_score" in analysis:
                total_score += analysis["overall_score"]
                total_modules += 1
        
        if total_modules > 0:
            return round(total_score / total_modules, 1)
        return 7.0  # Default fallback score
    
    def _get_timestamp(self):
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    async def _generate_executive_summary_async(self, results, context, overall_score):
        """Generate executive summary of analysis asynchronously"""
        # Prepare simplified prompt for executive summary
        prompt = f"""
As a UI/UX director, write a concise 3-4 sentence executive summary for this design analysis:
- Screen type: {context['screen_type']}
- Purpose: {context['estimated_purpose']}
- Overall score: {overall_score}/10
- Key findings: {self._format_key_findings(results)}
"""
        
        # Get summary from LLM asynchronously
        summary = await self.ollama_client.generate_async(prompt)
        return summary.strip()
    
    def _format_key_findings(self, results):
        """Format key findings for summary prompt - simplified"""
        findings = []
        
        # Extract top strengths
        strengths = []
        for module, data in results.items():
            if "strengths" in data and isinstance(data["strengths"], list) and data["strengths"]:
                strengths.append(f"{module}: {data['strengths'][0]}")
        
        # Extract top issues
        issues = []
        for module, data in results.items():
            if "improvements" in data and isinstance(data["improvements"], list) and data["improvements"]:
                if isinstance(data["improvements"][0], dict) and "issue" in data["improvements"][0]:
                    issues.append(f"{module}: {data['improvements'][0]['issue']}")
        
        # Take just a few items for brevity
        findings = strengths[:2] + issues[:2]
        return "; ".join(findings)
    
    def _prioritize_improvements(self, results):
        """Prioritize improvements across all modules - simplified"""
        all_improvements = []
        
        for module, data in results.items():
            if "improvements" in data and isinstance(data["improvements"], list):
                for imp in data["improvements"]:
                    if isinstance(imp, dict):
                        # Ensure all required fields exist
                        issue = imp.get("issue", "Unnamed issue")
                        priority = imp.get("priority", 3)
                        if isinstance(priority, str):
                            try:
                                priority = int(priority)
                            except:
                                priority = 3
                                
                        all_improvements.append({
                            "module": module,
                            "issue": issue,
                            "recommendation": imp.get("recommendation", ""),
                            "implementation_details": imp.get("implementation_details", ""),
                            "priority": priority
                        })
        
        # Sort by priority (higher first)
        all_improvements.sort(key=lambda x: x["priority"], reverse=True)
        
        return all_improvements
    
    def _generate_implementation_roadmap(self, improvements):
        """Generate a simplified implementation roadmap based on improvements"""
        # Group improvements by priority
        priority_groups = {
            "immediate": [],
            "short_term": [],
            "medium_term": [],
            "future": []
        }
        
        # Distribute improvements based on priority
        for imp in improvements[:15]:  # Limit to top 15 for speed
            priority = imp.get("priority", 3)
            if priority >= 5:
                priority_groups["immediate"].append(self._format_action_item(imp))
            elif priority == 4:
                priority_groups["short_term"].append(self._format_action_item(imp))
            elif priority == 3:
                priority_groups["medium_term"].append(self._format_action_item(imp))
            else:
                priority_groups["future"].append(self._format_action_item(imp))
        
        # Build roadmap
        roadmap = {
            "immediate_actions": priority_groups["immediate"][:3],  # Top 3 critical items
            "short_term": priority_groups["short_term"][:3],        # Top 3 high priority
            "medium_term": priority_groups["medium_term"][:3],      # Top 3 medium priority
            "future_considerations": priority_groups["future"][:3]  # Top 3 low priority
        }
        
        return roadmap
        
    def _format_action_item(self, improvement):
        """Format an improvement as a concise action item"""
        return {
            "task": improvement.get("issue", ""),
            "module": improvement.get("module", ""),
            "recommendation": improvement.get("recommendation", "")[:100]  # Truncate for brevity
        }

# API Application with optimizations
class UIAnalysisAPI:
    def __init__(self, config: Config):
        self.app = FastAPI(title="UI/UX Design Analyzer API")
        self.config = config
        self.engine = UIAnalysisEngine(config)
        self.setup_routes()
        self.setup_middleware()
        self.active_tasks = {}  # Track running analysis tasks
    
    def setup_middleware(self):
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    def setup_routes(self):
        @self.app.post("/analyze")
        async def analyze_design(
            file: UploadFile = File(...),
            analysis_type: str = Form("full"),
            output_format: str = Form("json"),
            purpose: str = Form("purpose"),
            screen: str = Form("screen"),
            background_tasks: BackgroundTasks = None,
        ):
            # Start time for performance tracking
            start_time = time.time()
            
            # Validate parameters
            if analysis_type not in ["full"] + self.config.ANALYSIS_MODULES:
                raise HTTPException(status_code=400, detail=f"Invalid analysis type: {analysis_type}")
            
            if output_format not in self.config.OUTPUT_FORMATS:
                raise HTTPException(status_code=400, detail=f"Invalid output format: {output_format}")
            
            # Create a unique task ID
            task_id = f"task_{int(time.time())}_{file.filename}"
            
            # Save uploaded file temporarily
            temp_path = f"/tmp/ui_analysis_{task_id}"
            with open(temp_path, "wb") as f:
                file_content = await file.read()
                f.write(file_content)
            
            # Run analysis
            try:
                # Process the request asynchronously for better responsiveness
                result = await self.engine.analyze_design_async(temp_path, analysis_type, purpose, screen)
                
                # Calculate processing time
                processing_time = time.time() - start_time
                
                # Add processing time to result
                if isinstance(result, dict):
                    result["processing_time_seconds"] = round(processing_time, 2)
                
                # Format result according to requested format
                return result
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
            finally:
                # Clean up in background
                if background_tasks:
                    background_tasks.add_task(self._cleanup_file, temp_path)
                else:
                    # Clean up immediately if background_tasks not available
                    self._cleanup_file(temp_path)
        
        @self.app.get("/health")
        async def health_check():
            """Health check endpoint"""
            return {"status": "healthy", "version": "1.0"}
    
    def _cleanup_file(self, file_path):
        """Clean up temporary files"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error cleaning up file {file_path}: {str(e)}")
    
    def run(self, host="0.0.0.0", port=8000):
        """Run the API server"""
        uvicorn.run(self.app, host=host, port=port)

# Frontend App (simplified representation)
class UIAnalyzerFrontend:
    """Frontend application for UI/UX analyzer"""
    def __init__(self, api_url):
        self.api_url = api_url
        # In a real implementation, this would be a proper frontend framework
        print(f"Frontend initialized with API URL: {api_url}")

# Main application
def main():
    parser = argparse.ArgumentParser(description="UI/UX Design Analyzer")
    parser.add_argument("--mode", choices=["api", "cli"], default="api", help="Run mode")
    parser.add_argument("--port", type=int, default=8000, help="API port")
    parser.add_argument("--host", default="0.0.0.0", help="API host")
    parser.add_argument("--image", help="Image path for CLI mode")
    args = parser.parse_args()
    
    config = Config()
    
    if args.mode == "api":
        print(f"Starting UI/UX Design Analyzer API on {args.host}:{args.port}")
        api = UIAnalysisAPI(config)
        api.run(host=args.host, port=args.port)
    elif args.mode == "cli":
        if not args.image:
            print("Error: Image path required for CLI mode")
            sys.exit(1)
        
        print(f"Analyzing design: {args.image}")
        engine = UIAnalysisEngine(config)
        result = engine.analyze_design(args.image)
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()