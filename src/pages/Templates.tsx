import { useAtomValue, useSetAtom } from "jotai";
import { Link, useNavigate } from "react-router";
import { templateMatricesAtom, addMatrixAtom } from "@/store/matrices";
import { createFromTemplate } from "@/store/matrix-utils";
import { getIcon } from "@/lib/icons";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DecisionMatrix } from "@/types/matrix";

// Helper function to format dates
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Helper function to generate a title for new matrix from template
function generateMatrixTitle(templateTitle: string): string {
  // Remove "Template" from the title if present
  let title = templateTitle.replace(/\s*template\s*/gi, "").trim();
  
  // Add "My" prefix if not already present
  if (!title.toLowerCase().startsWith("my ")) {
    title = `My ${title}`;
  }
  
  // Add "Decision" if title seems too short
  if (title.split(" ").length < 3) {
    title = `${title} Decision`;
  }
  
  return title;
}

export default function Templates() {
  const templates = useAtomValue(templateMatricesAtom);
  const addMatrix = useSetAtom(addMatrixAtom);
  const navigate = useNavigate();

  const handleUseTemplate = (template: DecisionMatrix) => {
    const newTitle = generateMatrixTitle(template.title);
    const newMatrix = createFromTemplate(template, newTitle);
    addMatrix(newMatrix);
    navigate(`/${newMatrix.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Matrix Templates</h1>
        <p className="text-muted-foreground">
          Browse and use pre-built matrix templates to get started quickly.
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
          <p className="text-muted-foreground mb-4">
            There are no matrix templates available yet.
          </p>
          <Link to="/new">
            <Button>Create Your First Matrix</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const IconComponent = getIcon(template.icon);

            return (
              <div
                key={template.id}
                className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {template.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>Template</span>
                      </div>
                    </div>
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {template.description}
                  </p>
                )}

                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Criteria ({template.rows.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {template.rows.slice(0, 3).map((row) => (
                        <span
                          key={row.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          {row.name}
                          {row.inverted && " ↓"}
                        </span>
                      ))}
                      {template.rows.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{template.rows.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Created {formatDate(template.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/${template.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
