"use client";

import type React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ImagePlus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Item } from "@/types/item";
import axios from "axios";

// Predefined categories for tools
const TOOL_CATEGORIES = [
  { value: "hand-tools", label: "Hand Tools" },
  { value: "power-tools", label: "Power Tools" },
  { value: "measuring-tools", label: "Measuring Tools" },
  { value: "cutting-tools", label: "Cutting Tools" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "safety", label: "Safety Equipment" },
  { value: "boards", label: "Electronic Boards" },
  { value: "components", label: "Electronic Components" },
  { value: "other", label: "Other" },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  maxQuantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  currentQuantity: z.coerce
    .number()
    .min(0, "Available quantity cannot be negative"),
  image: z.instanceof(File).optional(),
});

interface ItemFormProps {
  initialData?: Item;
}

export function ItemForm({ initialData }: ItemFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.ImageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!initialData?.ID;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find the category value from the predefined list or use "other" as default
  const getCategoryValue = (category: string | undefined) => {
    if (!category) return "";
    const found = TOOL_CATEGORIES.find(
      (c) =>
        c.label.toLowerCase() === category.toLowerCase() ||
        c.value === category.toLowerCase()
    );
    return found ? found.value : "other";
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.Name || "",
      description: initialData?.Description || "",
      category: getCategoryValue(initialData?.Category),
      maxQuantity: initialData?.MaxQuantity || 1,
      currentQuantity: initialData?.CurrentQuantity || 0,
    },
  });

  useEffect(() => {
    const categoryValue = getCategoryValue(initialData?.Category);

    if (initialData) {
      form.reset({
        name: initialData.Name,
        description: initialData.Description || "",
        category: categoryValue,
        maxQuantity: initialData.MaxQuantity,
        currentQuantity: initialData.CurrentQuantity,
      });
      setImagePreview(initialData.ImageUrl);
    }
  }, [initialData, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileChange(file);
  };

  const handleFileChange = useCallback(
    (file: File | undefined) => {
      if (!file) {
        form.setValue("image", undefined);
        setImagePreview(initialData?.ImageUrl || null);
        return;
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PNG and JPG images are allowed.",
          variant: "destructive",
        });
        return;
      }

      // Set the actual File object to the form value
      form.setValue("image", file);

      // Create preview from the file
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [form, initialData]
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.currentQuantity > values.maxQuantity) {
      toast({
        title: "Validation Error",
        description:
          "Available Quantity cannot be greater than Total Quantity.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const categoryLabel =
        TOOL_CATEGORIES.find((c) => c.value === values.category)?.label ||
        values.category;

      const formData = new FormData();

      const itemData = {
        name: values.name,
        description: values.description || "",
        category: values.category,
        maxQuantity: values.maxQuantity,
        currentQuantity: values.currentQuantity,
        imageUrl: "",
      };

      if (isEdit && initialData?.ImageUrl && !values.image) {
        itemData["imageUrl"] = initialData.ImageUrl;
      }

      formData.append("itemData", JSON.stringify(itemData));
      if (initialData?.ID) {
        if (values.image instanceof File) {
          formData.append("file", values.image);
          setIsUploading(true);
          axios.put(
            `https://en-w-backend.onrender.com/admin/item/img/${initialData.ID}`,
            formData
          );
        } else {
          axios.put(
            `https://en-w-backend.onrender.com/admin/item/${initialData.ID}`,
            formData
          );
        }

        toast({
          title: "Item updated",
          description: `Successfully updated ${values.name}`,
        });
      } else {
        if (values.image instanceof File) {
          formData.append("file", values.image);
          
        }
        await axios.post(`https://en-w-backend.onrender.com/item`, formData);

        toast({
          title: "Item created",
          description: `Successfully created ${values.name}`,
        });
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          initialData ? "update" : "create"
        } item. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-4 bg-muted rounded-lg overflow-hidden flex items-center justify-center border">
                {imagePreview ? (
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Item preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">No image</div>
                )}
              </div>
              <div className="w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {isUploading
                    ? "Uploading..."
                    : imagePreview
                    ? "Change Image"
                    : "Upload Image"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Recommended: 1:1 aspect ratio, max 5MB
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Item description (optional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TOOL_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        disabled={isEdit} // เปลี่ยนจาก true เป็น isEdit
                        className={isEdit ? "bg-muted cursor-not-allowed" : ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {isEdit
                        ? "Total number of this item (not editable)"
                        : "Total number of this item"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={form.watch("maxQuantity")}
                        {...field}
                        disabled={isEdit} // เปลี่ยนจาก true เป็น isEdit
                        className={isEdit ? "bg-muted cursor-not-allowed" : ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {isEdit
                        ? "Currently available (not editable)"
                        : "Currently available quantity"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {(isSubmitting || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
