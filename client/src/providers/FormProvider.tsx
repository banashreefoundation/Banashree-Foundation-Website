/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, ReactNode, useContext } from "react";
import { useForm, FormProvider as RHFProvider, UseFormReturn, FieldValues } from "react-hook-form";
import { z, ZodSchema } from "zod";

interface GenericFormProviderProps<T extends ZodSchema<any>> {
  children: ReactNode;
  schema: T;
  defaultValues: z.infer<T>;
}

const FormContext = createContext<UseFormReturn<any> | null>(null)

export function GenericFormProvider<T extends ZodSchema<any>>({
  children,
  schema,
  defaultValues,
}: GenericFormProviderProps<T>) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  return (
    <FormContext.Provider value={methods}>
      <RHFProvider {...methods}>{children}</RHFProvider>
    </FormContext.Provider>
  )
}

export function useGenericFormContext<T extends FieldValues>(): UseFormReturn<T> {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useGenericFormContext must be used within a GenericFormProvider");
  }
  return context;
}