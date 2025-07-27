import { Link } from "react-router";
import {
  Sidebar,
  Plus,
  FileText,
  Building,
  MousePointer2,
  Crown,
  Info,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8 pb-16">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">How to Use This Website</h1>
        <p className="text-muted-foreground text-lg">
          A complete guide to navigating the Decision Matrix Tool and creating
          effective decision matrices.
        </p>
      </div>

      {/* Getting Started */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Getting Started
        </h2>

        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sidebar className="h-5 w-5" />
            Navigating the Sidebar
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center gap-2 min-w-[140px] text-sm">
                <Plus className="h-4 w-4" />
                <span className="font-medium">New Matrix</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create a new decision matrix with your own criteria and options
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 min-w-[140px] text-sm">
                <FileText className="h-4 w-4" />
                <span className="font-medium">New Template</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create a reusable template with criteria that you can reuse
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 min-w-[140px] text-sm">
                <Building className="h-4 w-4" />
                <span className="font-medium">View Templates</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Browse existing templates and use them to create new matrices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Creating Your First Matrix */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Creating Your First Matrix
        </h2>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Basic Information</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Title:</strong> Give your matrix a descriptive name
                  (e.g., "Car Purchase Decision")
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Icon:</strong> Choose an icon to help identify your
                  matrix
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Description:</strong> Optionally describe what you're
                  deciding
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Define Criteria</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Name:</strong> What factors matter? (Price, Quality,
                  Location, etc.)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Weight (1-5):</strong> How important is this
                  criterion? 5 = very important, 1 = less important
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Inverted:</strong> Check this for criteria where lower
                  values are better (like price or commute time)
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Add Options</h3>
            <p className="text-sm text-muted-foreground">
              List the choices you're comparing (Car A, Car B, Car C). You can
              add as many options as needed.
              <strong> Note:</strong> Skip this step if you're creating a
              template - templates don't include specific options.
            </p>
          </div>
        </div>
      </div>

      {/* Working with Templates */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Working with Templates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Using Existing Templates</h3>
            <ol className="space-y-2 text-sm">
              <li>1. Click "View Templates" in the sidebar</li>
              <li>2. Browse available templates</li>
              <li>3. Click "Use Template" on one you like</li>
              <li>
                4. The criteria are already set up - just add your options!
              </li>
            </ol>
          </div>

          <div className="bg-background border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Creating Templates</h3>
            <ol className="space-y-2 text-sm">
              <li>1. Click "New Template" in the sidebar</li>
              <li>2. Set up criteria that work for any similar decision</li>
              <li>3. Don't add specific options - leave that for users</li>
              <li>4. Add a good description explaining when to use it</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Using the Matrix Interface */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Using the Matrix Interface
        </h2>

        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MousePointer2 className="h-5 w-5" />
              Interactive Features
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Drag to Update:</strong> Click and drag on any score
                  to change it instantly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Criteria Controls:</strong> Hover over criteria names
                  to see delete options
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Column Headers:</strong> Hover over column names to
                  see delete options
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Add Items:</strong> Use the + buttons to add new
                  criteria or options
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Understanding Results
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Color Coding:</strong> Red = low scores, Yellow =
                  medium, Green = high scores
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Winner Badge:</strong> The option with the highest
                  weighted average gets a crown icon
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Inverted Scores:</strong> For inverted criteria, the
                  color coding is reversed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Average Row:</strong> Shows the final weighted scores
                  for each option
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips for Better Decisions */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Tips for Better Decision Making
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700">
              ✓ Best Practices
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Keep criteria independent (avoid overlap)</li>
              <li>• Use 3-7 criteria for best results</li>
              <li>• Be consistent when scoring options</li>
              <li>• Review and adjust weights if needed</li>
              <li>• Consider using existing templates first</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-700">
              ✗ Common Mistakes
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Making all weights the same (defeats the purpose)</li>
              <li>• Forgetting to mark price-like criteria as inverted</li>
              <li>• Using too many similar criteria</li>
              <li>
                • Scoring based on final preference rather than each criterion
              </li>
              <li>• Not considering all relevant factors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-primary/5 rounded-lg p-8 text-center space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Create Your First Matrix
          </Link>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 border border-input bg-background px-6 py-3 rounded-md hover:bg-accent transition-colors font-medium"
          >
            <Building className="h-4 w-4" />
            Browse Templates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
