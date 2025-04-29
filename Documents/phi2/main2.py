import os
import sys
import argparse
import json
from typing import Dict, List, Any, Optional, Tuple
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
import requests
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import httpx

# Configuration
class Config:
    OLLAMA_ENDPOINT = "http://localhost:11434/api/generate"
    MODEL_NAME = "phi3"
    MAX_TOKENS = 4096
    TEMP = 0.7
    ANALYSIS_MODULES = ["layout", "color", "typography", "accessibility", "usability"]
    OUTPUT_FORMATS = ["json", "html", "markdown"]

# Core UI Analysis Engine
class UIAnalysisEngine:
    def __init__(self, config: Config):
        self.config = config
        self.ollama_client = OllamaClient(config.OLLAMA_ENDPOINT, config.MODEL_NAME)
        self.modules = self._load_modules()
        
    def _load_modules(self):
        """Load analysis modules"""
        modules = {}
        for module_name in self.config.ANALYSIS_MODULES:
            modules[module_name] = self._initialize_module(module_name)
        return modules
        
    def _initialize_module(self, module_name):
        """Initialize a specific analysis module with expert prompts"""
        # Module-specific expert prompts would be defined here
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
            "prompt": module_prompts.get(module_name, "Analyze this aspect of the UI design"),
            "analyzer": getattr(self, f"_analyze_{module_name}", self._default_analyzer)
        }
    
    def _default_analyzer(self, image_data, context=None):
        """Default analysis function if specialized one doesn't exist"""
        return {}
        
    def _analyze_layout(self, image_data, context=None):
        """Layout analysis implementation"""
        # Here you would implement computer vision techniques to analyze layout
        # For demonstration, returning placeholder
        return {
            "grid_alignment": 0.85,
            "visual_hierarchy": 0.76,
            "whitespace_usage": 0.68,
            "detected_sections": ["header", "main_content", "sidebar", "footer"]
        }
    
    def _analyze_color(self, image_data, context=None):
        """Color analysis implementation"""
        # Implement color extraction and analysis
        # For demonstration, returning placeholder
        return {
            "primary_colors": ["#3366CC", "#FFFFFF", "#F5F5F5", "#333333"],
            "contrast_ratio": 4.5,
            "color_harmony": "complementary",
            "accessibility_issues": 2
        }
    
    def analyze_design(self, image_path: str, analysis_type: str = "full", purpose: str = "dashboard", screen: str = "desktop") -> Dict[str, Any]:
        """Main analysis entry point"""
        try:
            # Load and preprocess image
            image = self._load_image(image_path)
            image_data = self._preprocess_image(image)
            
            context = {
                "screen_type": screen,
                "estimated_purpose": purpose,
                "complexity_level": "medium"
            }
            
            # Run selected analyses
            results = {}
            if analysis_type == "full":
                for module_name, module in self.modules.items():
                    results[module_name] = self._run_module_analysis(module_name, image_data, context)
            else:
                if analysis_type in self.modules:
                    results[analysis_type] = self._run_module_analysis(analysis_type, image_data, context)
                else:
                    raise ValueError(f"Unknown analysis type: {analysis_type}")
            
            # Generate comprehensive report
            report = self._generate_report(image_data, results, context)
            return report
            
        except Exception as e:
            print(f"Analysis error: {str(e)}")
            return {"error": str(e)}
    
    def _load_image(self, image_path):
        """Load image from path"""
        return Image.open(image_path)
    
    def _preprocess_image(self, image):
        """Preprocess image for analysis"""
        # Convert to numpy array for CV operations
        image_np = np.array(image)
        
        # Basic preprocessing operations
        # Resize if needed
        max_dim = 1200
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
    
    def _extract_design_context(self, image_data):
        """Extract context about the design"""
        # This would analyze the image to determine context
        # For example: is it mobile or desktop? What type of application?
        
        # For demonstration, returning placeholder
        return {
            "screen_type": "desktop",
            "estimated_purpose": "e-commerce",
            "complexity_level": "medium"
        }
    
    def _run_module_analysis(self, module_name, image_data, context):
        """Run analysis for a specific module"""
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
        
        image_description = f"[Image Description: A {context['screen_type']} UI/UX or {context['estimated_purpose']} application]"
        
        prompt = f"""
    You are a professional UI/UX design expert specializing in {module_name} analysis.
            
    Analyze the following UI design:

    {image_description}

    Context information:
    - Screen type: {context['screen_type']}
    - Estimated purpose: {context['estimated_purpose']}
    - Complexity: {context['complexity_level']}

    Computer vision detected metrics:
    {json.dumps(cv_metrics, indent=2)}

    {base_prompt}

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

    Ensure that your recommendations are very specific - avoid vague advice like "improve contrast" and instead say exactly what should be changed (e.g., "Change the button text color from #777777 to #121212 to achieve a contrast ratio of at least 4.5:1").
    """
        return prompt
    
    def _structure_analysis(self, module_name, llm_analysis, cv_metrics):
        """Structure the LLM analysis output"""
        # In a real implementation, you'd parse the JSON from the LLM
        # For demonstration, simulating structured output
        
        try:
            # Parse LLM output as JSON
            analysis_data = json.loads(llm_analysis)
            
            # Combine with CV metrics
            analysis_data.update({
                "cv_metrics": cv_metrics,
                "module": module_name
            })
            
            return analysis_data
        except:
            # Fallback if JSON parsing fails
            return {
                "module": module_name,
                "cv_metrics": cv_metrics,
                "overall_score": 7,
                "error": "Failed to parse structured analysis",
                "raw_analysis": llm_analysis[:500]  # Truncated for brevity
            }
    
    def _generate_report(self, image_data, results, context):
        """Generate comprehensive design analysis report with actionable items"""
        # Calculate overall metrics
        overall_score = 0
        total_modules = 0
        
        for module_name, analysis in results.items():
            if "overall_score" in analysis:
                overall_score += analysis["overall_score"]
                total_modules += 1
        
        if total_modules > 0:
            overall_score /= total_modules
        
        # Extract all improvements across modules
        all_improvements = self._prioritize_improvements(results)
        
        # Generate implementation roadmap
        implementation_roadmap = self._generate_implementation_roadmap(all_improvements)
        
        # Compile report
        report = {
            "timestamp": self._get_timestamp(),
            "design_context": context,
            "overall_score": round(overall_score, 1),
            "modules_analyzed": list(results.keys()),
            "detailed_results": results,
            "summary": self._generate_executive_summary(results, context, overall_score),
            "improvement_priority": all_improvements,
            "implementation_roadmap": implementation_roadmap,
            "visual_recommendations": self._generate_visual_recommendations(image_data, all_improvements)
        }
        
        return report
    
    def _estimate_effort(self, improvement):
        """Estimate the effort required for an improvement"""
        # This would use more sophisticated logic in a real implementation
        module = improvement.get("module", "")
        details = improvement.get("implementation_details", "").lower()
        
        # Default medium effort
        effort = "medium"
        
        # Adjust based on implementation details
        if "simple" in details or "minor" in details or "small" in details:
            effort = "low"
        elif "significant" in details or "major" in details or "complex" in details:
            effort = "high"
        
        # Adjust based on module
        if module == "layout" and "restructure" in details:
            effort = "high"
        elif module == "color" and "palette" in details:
            effort = "medium"
        
        return effort
    
    def _create_action_item(self, improvement):
        """Format an improvement as an actionable task"""
        return {
            "task": improvement.get("issue", "Unknown issue"),
            "implementation": improvement.get("implementation_details", ""),
            "expected_impact": improvement.get("impact", ""),
            "module": improvement.get("module", ""),
            "estimated_effort": self._estimate_effort(improvement)
        }

    def _identify_affected_elements(self, category, changes):
        """Identify UI elements affected by changes"""
        # This would use more sophisticated logic in a real implementation
        elements = set()
        
        for change in changes:
            issue = change.get("issue", "").lower()
            
            # Extract mentioned UI elements
            if "button" in issue:
                elements.add("button")
            if "header" in issue:
                elements.add("header")
            if "text" in issue or "font" in issue:
                elements.add("text")
            if "image" in issue:
                elements.add("image")
            if "navigation" in issue or "menu" in issue:
                elements.add("navigation")
            if "form" in issue or "input" in issue:
                elements.add("form")
            
            # Add a default if nothing found
            if not elements:
                if category == "color":
                    elements.add("color scheme")
                elif category == "layout":
                    elements.add("page layout")
                elif category == "typography":
                    elements.add("text elements")
                else:
                    elements.add("UI components")
        
        return list(elements)


    def _generate_visual_recommendations(self, image_data, improvements):
        """Generate visual guides for implementation recommendations"""
        # In a real implementation, this would create annotated versions of the UI
        # with visual indicators showing what needs to be changed
        
        visual_recommendations = []
        
        # Group similar visual changes
        visual_changes = {
            "color": [],
            "layout": [],
            "typography": [],
            "components": []
        }
        
        for imp in improvements:
            module = imp.get("module", "")
            if module in ["color", "layout", "typography"]:
                visual_changes[module].append(imp)
            else:
                visual_changes["components"].append(imp)
        
        # For each category, create a visual recommendation
        for category, changes in visual_changes.items():
            if changes:
                visual_recommendations.append({
                    "category": category,
                    "affected_elements": self._identify_affected_elements(category, changes),
                    "visualization_type": "annotated_image",  # or "before_after", "mockup", etc.
                    "changes": [{"description": c.get("issue", ""), "solution": c.get("recommendation", "")} for c in changes[:3]]
                })
        
        return visual_recommendations

    def _calculate_effort_allocation(self, improvements, category):
        """Calculate effort allocation for a specific category"""
        # This would use more sophisticated logic in a real implementation
        
        # Count occurrences of category in improvements
        count = 0
        for imp in improvements:
            details = imp.get("implementation_details", "").lower()
            if category == "design" and any(x in details for x in ["layout", "visual", "color", "spacing"]):
                count += 1
            elif category == "development" and any(x in details for x in ["code", "implement", "function"]):
                count += 1
            elif category == "content" and any(x in details for x in ["text", "wording", "message"]):
                count += 1
            elif category == "testing" and any(x in details for x in ["test", "validate", "verify"]):
                count += 1
        
        # Calculate percentage
        percent = int((count / max(1, len(improvements))) * 100)
        return f"{percent}%"

    def _generate_implementation_roadmap(self, improvements):
        """Generate a structured implementation roadmap based on improvements"""
        # Group improvements by priority
        priority_groups = {
            "critical": [],
            "high": [],
            "medium": [],
            "low": []
        }
        
        for imp in improvements:
            priority = imp.get("priority", 3)
            if priority >= 5:
                priority_groups["critical"].append(imp)
            elif priority == 4:
                priority_groups["high"].append(imp)
            elif priority == 3:
                priority_groups["medium"].append(imp)
            else:
                priority_groups["low"].append(imp)
        
        # Generate roadmap with timeframes
        roadmap = {
            "immediate_actions": [self._create_action_item(imp) for imp in priority_groups["critical"]],
            "short_term": [self._create_action_item(imp) for imp in priority_groups["high"]],
            "medium_term": [self._create_action_item(imp) for imp in priority_groups["medium"]],
            "future_considerations": [self._create_action_item(imp) for imp in priority_groups["low"]]
        }
        
        # Add estimated effort levels
        roadmap["effort_allocation"] = {
            "design_updates": self._calculate_effort_allocation(improvements, "design"),
            "development_updates": self._calculate_effort_allocation(improvements, "development"),
            "content_updates": self._calculate_effort_allocation(improvements, "content"),
            "testing_required": self._calculate_effort_allocation(improvements, "testing")
        }
        
        return roadmap
    
    def _get_timestamp(self):
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def _generate_executive_summary(self, results, context, overall_score):
        """Generate executive summary of analysis"""
        # Prepare prompt for executive summary
        prompt = f"""
You are a senior UI/UX design director providing an executive summary.

Design context:
- Screen type: {context['screen_type']}
- Estimated purpose: {context['estimated_purpose']}
- Overall score: {overall_score}/10

Module scores:
{self._format_module_scores(results)}

Key improvements needed:
{self._format_key_improvements(results)}

Create a brief, professional executive summary (3-4 sentences) that captures the essence of this design analysis. Be specific but concise.
"""
        
        # Get summary from LLM
        summary = self.ollama_client.generate(prompt)
        return summary.strip()
    
    def _format_module_scores(self, results):
        """Format module scores for summary prompt"""
        scores = []
        for module, data in results.items():
            if "overall_score" in data:
                scores.append(f"- {module.capitalize()}: {data['overall_score']}/10")
        return "\n".join(scores)
    
    def _format_key_improvements(self, results):
        """Format key improvements for summary prompt"""
        improvements = []
        for module, data in results.items():
            if "improvements" in data and isinstance(data["improvements"], list):
                for imp in data["improvements"][:2]:  # Take top 2 from each module
                    if isinstance(imp, dict) and "issue" in imp:
                        improvements.append(f"- {module.capitalize()}: {imp['issue']}")
                    elif isinstance(imp, str):
                        improvements.append(f"- {module.capitalize()}: {imp}")
        return "\n".join(improvements[:5])  # Limit to top 5 overall
    
    def _prioritize_improvements(self, results):
        """Prioritize improvements across all modules"""
        all_improvements = []
        
        for module, data in results.items():
            if "improvements" in data and isinstance(data["improvements"], list):
                for imp in data["improvements"]:
                    if isinstance(imp, dict):
                        all_improvements.append({
                            "module": module,
                            "issue": imp.get("issue", "Unknown issue"),
                            "recommendation": imp.get("recommendation", ""),
                            "priority": self._calculate_priority(module, imp)
                        })
                    elif isinstance(imp, str):
                        all_improvements.append({
                            "module": module,
                            "issue": imp,
                            "recommendation": "",
                            "priority": self._calculate_priority(module, {"issue": imp})
                        })
        
        # Sort by priority (higher first)
        all_improvements.sort(key=lambda x: x["priority"], reverse=True)
        
        return all_improvements
    
    def _calculate_priority(self, module, improvement):
        """Calculate priority for an improvement"""
        # In a real implementation, this would use more sophisticated logic
        priority_words = {
            "critical": 5,
            "important": 4,
            "significant": 3,
            "consider": 2,
            "minor": 1
        }
        
        # Default medium priority
        priority = 3
        
        # Check for priority words
        issue = improvement.get("issue", "").lower()
        for word, value in priority_words.items():
            if word in issue:
                priority = value
                break
        
        # Adjust for module type (e.g., accessibility might be weighted higher)
        if module == "accessibility":
            priority += 1
        
        return min(priority, 5)  # Cap at 5

# Ollama Client
class OllamaClient:
    def __init__(self, endpoint, model_name, max_tokens=4096, temperature=0.7):
        self.endpoint = endpoint
        self.model_name = model_name
        self.max_tokens = max_tokens
        self.temperature = temperature
    
    def generate(self, prompt):
        """Generate text using Ollama API"""
        try:
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": self.temperature,
                    "num_predict": self.max_tokens
                }
            }
            
            response = requests.post(self.endpoint, json=payload)
            
            if response.status_code == 200:
                return response.json().get("response", "")
            else:
                print(f"Error: {response.status_code} - {response.text}")
                return f"Error generating response: {response.status_code}"
                
        except Exception as e:
            print(f"Generation error: {str(e)}")
            return f"Error: {str(e)}"

# API Application
class UIAnalysisAPI:
    def __init__(self, config: Config):
        self.app = FastAPI(title="UI/UX Design Analyzer API")
        self.config = config
        self.engine = UIAnalysisEngine(config)
        self.setup_routes()
        self.setup_middleware()
    
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
        ):
            # Validate parameters
            if analysis_type not in ["full"] + self.config.ANALYSIS_MODULES:
                raise HTTPException(status_code=400, detail=f"Invalid analysis type: {analysis_type}")
            
            if output_format not in self.config.OUTPUT_FORMATS:
                raise HTTPException(status_code=400, detail=f"Invalid output format: {output_format}")
            
            # Save uploaded file temporarily
            temp_path = f"/tmp/ui_analysis_{file.filename}"
            with open(temp_path, "wb") as f:
                f.write(await file.read())
            
            # Run analysis
            try:
                result = self.engine.analyze_design(temp_path, analysis_type, purpose, screen)
                
                # Format result according to requested format
                if output_format == "json":
                    return result
                elif output_format == "html":
                    return self._format_as_html(result)
                elif output_format == "markdown":
                    return {"content": self._format_as_markdown(result)}
                
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
            finally:
                # Clean up
                if os.path.exists(temp_path):
                    os.remove(temp_path)
    
    def _format_as_html(self, result):
        """Format analysis result as HTML"""
        # Implementation would generate HTML report
        return {"html_content": "<h1>UI Analysis Report</h1>..."}
    
    def _format_as_markdown(self, result):
        """Format analysis result as Markdown"""
        # Implementation would generate Markdown report
        return f"# UI Analysis Report\n\n## Overall Score: {result['overall_score']}/10\n..."
    
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