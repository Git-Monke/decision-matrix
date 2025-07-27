import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { createMatrix } from "@/store/matrix-utils";
import { addMatrixAtom } from "@/store/matrices";
import { getAvailableIcons, getIcon } from "@/lib/icons";
import type { CreateMatrixInput } from "@/types/matrix";
import { Checkbox } from "@/components/ui/checkbox";

interface CriteriaInput {
  name: string;
  weight: number;
  inverted: boolean;
}

interface OptionInput {
  name: string;
}

export default function NewMatrix() {
  const navigate = useNavigate();
  const addMatrix = useSetAtom(addMatrixAtom);
  const [searchParams] = useSearchParams();
  
  const isTemplateMode = searchParams.get("template") === "true";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("BarChart3");
  const [isTemplate, setIsTemplate] = useState(isTemplateMode);

  const [criteria, setCriteria] = useState<CriteriaInput[]>([
    { name: "Price", weight: 3, inverted: true },
    { name: "Quality", weight: 4, inverted: false },
    { name: "Convenience", weight: 2, inverted: false },
  ]);

  const [options, setOptions] = useState<OptionInput[]>([
    { name: "Option A" },
    { name: "Option B" },
  ]);

  const availableIcons = getAvailableIcons();

  const addCriteria = () => {
    setCriteria([
      ...criteria,
      { name: "New Criteria", weight: 1, inverted: false },
    ]);
  };

  const removeCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const updateCriteria = (
    index: number,
    field: keyof CriteriaInput,
    value: any
  ) => {
    const updated = [...criteria];
    updated[index] = { ...updated[index], [field]: value };
    setCriteria(updated);
  };

  const addOption = () => {
    setOptions([...options, { name: "New Option" }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, name: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], name };
    setOptions(updated);
  };

  const handleSubmit = () => {
    if (!title.trim() || criteria.length === 0) {
      return;
    }

    const matrixInput: CreateMatrixInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      icon,
      rows: criteria.map((c) => ({
        name: c.name,
        weight: c.weight,
        inverted: c.inverted,
      })),
      columns: isTemplate ? [] : options.map((o) => ({ name: o.name })),
      isTemplate,
    };

    const newMatrix = createMatrix(matrixInput);
    addMatrix(newMatrix);
    navigate(`/${newMatrix.id}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent form submission on Enter - require button click
  };

  const IconComponent = getIcon(icon);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">
          {isTemplate ? "Create New Template" : "Create New Matrix"}
        </h1>
        <p className="text-muted-foreground">
          {isTemplate 
            ? "Create a reusable template with criteria that others can use to make decisions."
            : "Set up your decision matrix with criteria and options to compare."
          }
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-muted/20 p-6 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Vacation Destination, Car Purchase"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{icon}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((iconName) => {
                    const Icon = getIcon(iconName);
                    return (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{iconName}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isTemplate 
                ? "Describe what this template is for and how to use it..."
                : "Optional description of what you're deciding..."
              }
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isTemplate"
              checked={isTemplate}
              onCheckedChange={(checked) => setIsTemplate(checked as boolean)}
            />
            <Label htmlFor="isTemplate">
              Create as template for reuse
            </Label>
          </div>
        </div>

        {/* Criteria Builder */}
        <div className="bg-muted/20 p-6 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">Criteria (What to evaluate)</h2>

          <div className="space-y-3">
            {criteria.map((criteria_item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-background rounded border"
              >
                <div className="flex-1">
                  <Input
                    value={criteria_item.name}
                    onChange={(e) =>
                      updateCriteria(index, "name", e.target.value)
                    }
                    placeholder="Criteria name"
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={criteria_item.weight}
                    onChange={(e) =>
                      updateCriteria(
                        index,
                        "weight",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="text-center"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={criteria_item.inverted}
                    onCheckedChange={(checked) =>
                      updateCriteria(index, "inverted", checked)
                    }
                  />
                  <Label className="text-xs">Inverted</Label>
                </div>
                <Button
                  type="button"
                  onClick={() => removeCriteria(index)}
                  variant="outline"
                  size="sm"
                  disabled={criteria.length <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={addCriteria}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Criteria
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Weight: 1-5 importance scale. Inverted: check if higher values are
            worse (like price).
          </p>
        </div>

        {/* Options Builder */}
        {!isTemplate && (
          <div className="bg-muted/20 p-6 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold">Options (What to compare)</h2>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-background rounded border"
              >
                <div className="flex-1">
                  <Input
                    value={option.name}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder="Option name"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeOption(index)}
                  variant="outline"
                  size="sm"
                  disabled={options.length <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={addOption}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || criteria.length === 0}
          >
            {isTemplate ? "Create Template" : "Create Matrix"}
          </Button>
          <Link to="/">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
