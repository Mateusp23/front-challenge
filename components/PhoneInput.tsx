"use client";

import React from "react";
import { Input } from "@heroui/react";
import { UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";

interface PhoneInputProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors?: FieldErrors<any>;
  countryName?: string;
  dddName?: string;
  numberName?: string;
}

export function PhoneInput({
  setValue,
  watch,
  errors,
  countryName = "phone.country",
  dddName = "phone.ddd",
  numberName = "phone.number",
}: PhoneInputProps) {
  // Função para formatar apenas números
  const formatOnlyNumbers = (value: string) => {
    return value.replace(/\D/g, '');
  };

  // Handler para código do país (máximo 3 dígitos)
  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatOnlyNumbers(e.target.value).slice(0, 3);
    setValue(countryName, formatted);
  };

  // Handler para DDD (máximo 2 dígitos)
  const handleDDDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatOnlyNumbers(e.target.value).slice(0, 2);
    setValue(dddName, formatted);
  };

  // Handler para número de telefone (máximo 9 dígitos)
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatOnlyNumbers(e.target.value).slice(0, 9);
    setValue(numberName, formatted);
  };

  // Helper para acessar erros aninhados
  const getNestedError = (path: string) => {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = errors;
    for (const key of keys) {
      if (current?.[key]) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return current;
  };

  const countryError = getNestedError(countryName);
  const dddError = getNestedError(dddName);
  const numberError = getNestedError(numberName);

  return (
    <div className="grid grid-cols-3 gap-2">
      <Input 
        label="País" 
        placeholder="55"
        value={watch(countryName) || ''}
        onChange={handleCountryChange}
        isInvalid={!!countryError}
        errorMessage={countryError?.message}
        description="Código do país"
        inputMode="numeric"
      />
      <Input 
        label="DDD" 
        placeholder="11"
        value={watch(dddName) || ''}
        onChange={handleDDDChange}
        isInvalid={!!dddError}
        errorMessage={dddError?.message}
        description="2 dígitos"
        inputMode="numeric"
      />
      <Input 
        label="Número" 
        placeholder="987654321"
        value={watch(numberName) || ''}
        onChange={handlePhoneNumberChange}
        isInvalid={!!numberError}
        errorMessage={numberError?.message}
        description="8 ou 9 dígitos"
        inputMode="numeric"
      />
    </div>
  );
}
