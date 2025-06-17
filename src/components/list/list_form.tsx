import {
  type FormEvent,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { HexColorPicker } from "react-colorful";
import { Plus, Check, X, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListStore } from "@/stores/list_store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { List } from "@/types/list";

const DEFAULT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
  "#000000", // black
];

interface ListFormProps {
  list?: List;
  onComplete?: () => void;
  isOpen?: boolean;
}

export function ListForm({ list, onComplete, isOpen = true }: ListFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState("#3b82f6");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const { createList, updateList, lists } = useListStore();

  useEffect(() => {
    if (isOpen && nameRef.current) {
      const timer = setTimeout(() => {
        nameRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const validateTitle = useCallback(
    (title: string): string | null => {
      if (!title.trim()) {
        return "El nombre de la lista es requerido";
      }
      if (title.trim().length < 2) {
        return "El nombre debe tener al menos 2 caracteres";
      }
      if (title.trim().length > 50) {
        return "El nombre no puede exceder 50 caracteres";
      }

      const existingList = lists.find(
        (list) =>
          list.title.toLowerCase() === title.trim().toLowerCase() &&
          list.id !== list.id,
      );
      if (existingList) {
        return "Ya existe una lista con ese nombre";
      }

      return null;
    },
    [lists, list?.id],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const title = nameRef.current?.value?.trim() || "";
    const validationError = validateTitle(title);

    if (validationError) {
      setError(validationError);
      nameRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (list) {
        const listToUpdate = {
          id: list.id,
          title,
          color,
        };
        updateList(listToUpdate);
      } else {
        createList(title, color);
      }

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setError("Error al guardar la lista. Inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleInputChange = () => {
    if (error) {
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {list ? "Editar lista" : "Nueva lista"}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input con icono */}
            <div className="space-y-2">
              <label
                htmlFor="list-name"
                className="text-sm font-medium text-gray-700"
              >
                Nombre de la lista
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Plus className="text-gray-400 h-4 w-4" />
                </div>
                <input
                  id="list-name"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder:text-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  type="text"
                  placeholder={`${list ? `${list.title}` : "Nombre de la lista"}`}
                  ref={nameRef}
                  autoComplete="off"
                  maxLength={50}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  aria-invalid={!!error}
                  aria-describedby={error ? "list-error" : undefined}
                />
              </div>
              {error && (
                <div
                  id="list-error"
                  className="text-xs text-red-600 animate-in slide-in-from-top-1 duration-200"
                  role="alert"
                >
                  {error}
                </div>
              )}
            </div>

            {/* Selector de color */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Color de la lista
              </label>

              {/* Colores predefinidos */}
              <div className="grid grid-cols-5 gap-2">
                {DEFAULT_COLORS.map((defaultColor) => (
                  <button
                    key={defaultColor}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-md border-2 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
                      color === defaultColor
                        ? "border-gray-600 ring-2 ring-gray-300"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    style={{ backgroundColor: defaultColor }}
                    onClick={() => setColor(defaultColor)}
                    disabled={isSubmitting}
                    aria-label={`Seleccionar color ${defaultColor}`}
                  />
                ))}
              </div>

              {/* Selector de color personalizado */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Color personalizado:
                </span>
                <DropdownMenu
                  open={isColorPickerOpen}
                  onOpenChange={setIsColorPickerOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-8 h-8 rounded-md border-2 border-gray-300 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 relative",
                        isSubmitting && "opacity-50 cursor-not-allowed",
                      )}
                      style={{ backgroundColor: color }}
                      disabled={isSubmitting}
                      aria-label={`Color actual: ${color}`}
                    >
                      <Palette className="w-3 h-3 text-white/70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="border-gray-200 p-3"
                    align="start"
                  >
                    <HexColorPicker color={color} onChange={setColor} />
                    <div className="text-xs text-center text-gray-500 font-medium pt-2 border-t mt-2">
                      {color.toUpperCase()}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Preview del color seleccionado */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Vista previa:</span>
                <div
                  className="w-4 h-4 rounded border border-gray-200"
                  style={{ backgroundColor: list ? list.color : color }}
                />
                <span className="font-mono">{color.toUpperCase()}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {list ? "Guardar cambios" : "Crear lista"}
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
