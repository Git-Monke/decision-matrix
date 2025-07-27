import { useState } from "react";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import {
  ArrowLeft,
  Copy,
  FileInput,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { addMatrixAtom } from "@/store/matrices";
import { parseYamlToMatrix, validateYaml } from "@/store/yaml-parser";

const AI_PROMPT_TEMPLATE = `-- PUT WHAT YOU'RE TRYING TO DECIDE ON HERE --

Please create a decision matrix in YAML format for the decision above. Use this structure:

title: "Your Decision Title"
description: "Brief description of what you're deciding"
icon: "Car"  # Choose from: Car, Home, Briefcase, Plane, GraduationCap, Heart, etc.
isTemplate: false  # true for reusable templates, false for specific decisions
criteria:
  - name: "Criterion 1"
    weight: 5  # 1-5 scale, 5 = very important
    inverted: false  # true if lower values are better (like price)
  - name: "Criterion 2" 
    weight: 3
    inverted: true
options:
  - "Option A"
  - "Option B"
  - "Option C"

Note: For templates, omit the 'options' section. Do not include a 'data' section - users will fill in the values manually.`;

export default function ImportMatrix() {
  const navigate = useNavigate();
  const addMatrix = useSetAtom(addMatrixAtom);

  const [yamlInput, setYamlInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt:", err);
    }
  };

  const handleImport = async () => {
    if (!yamlInput.trim()) {
      setError("Please paste your YAML content");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Parse YAML and create matrix
      const matrix = parseYamlToMatrix(yamlInput);

      // Add matrix to store
      addMatrix(matrix);

      // Navigate to the new matrix
      navigate(`/${matrix.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import matrix");
    } finally {
      setIsProcessing(false);
    }
  };

  // Real-time validation
  const validation = yamlInput.trim() ? validateYaml(yamlInput) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <FileInput className="h-8 w-8" />
            Import Decision Matrix
          </h1>
          <p className="text-muted-foreground text-lg">
            Use AI to generate decision matrices quickly and import them with
            YAML
          </p>
        </div>
      </div>

      {/* Section 1: AI Prompt Generator */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">
          1. Generate with AI
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">AI Prompt Template</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Copy this prompt and paste it into ChatGPT, Claude, or any AI
                assistant to generate your decision matrix.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 ml-4"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Prompt
                </>
              )}
            </Button>
          </div>

          <div className="bg-white border rounded-md p-4 font-mono text-sm overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">{AI_PROMPT_TEMPLATE}</pre>
          </div>
        </div>
      </div>

      {/* Section 2: YAML Input */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">
          2. Paste Generated YAML
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="yaml-input" className="text-base font-medium">
              YAML Content
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Paste the YAML generated by your AI assistant below
            </p>
            <Textarea
              id="yaml-input"
              value={yamlInput}
              onChange={(e) => {
                setYamlInput(e.target.value);
                if (error) setError(null); // Clear error when user types
              }}
              placeholder="Paste your YAML content here..."
              className={`min-h-[300px] font-mono text-sm ${
                validation && !validation.isValid
                  ? "border-red-300 focus:border-red-500"
                  : validation && validation.isValid
                  ? "border-green-300 focus:border-green-500"
                  : ""
              }`}
            />
          </div>

          {/* Validation feedback */}
          {validation && !validation.isValid && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{validation.error}</span>
            </div>
          )}

          {validation && validation.isValid && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">
                YAML is valid and ready to import!
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Import Controls */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">
          3. Import Matrix
        </h2>

        <div className="bg-muted/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to Import</h3>
              <p className="text-sm text-muted-foreground">
                Review your YAML content above, then click import to create your
                decision matrix.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/">Cancel</Link>
              </Button>
              <Button
                onClick={handleImport}
                disabled={
                  !yamlInput.trim() ||
                  isProcessing ||
                  (validation?.isValid === false)
                }
                className="min-w-[120px]"
              >
                {isProcessing ? (
                  "Importing..."
                ) : (
                  <>
                    <FileInput className="h-4 w-4 mr-2" />
                    Import Matrix
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Tips for Better Results</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-0.5">•</span>
            <span>
              Be specific about what you're trying to decide when prompting the
              AI
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-0.5">•</span>
            <span>
              Ask the AI to include relevant criteria with appropriate weights
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-0.5">•</span>
            <span>
              For price-like criteria, remember to set "inverted: true"
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-0.5">•</span>
            <span>
              You can edit the matrix after importing to fine-tune values
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
