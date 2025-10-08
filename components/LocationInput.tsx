'use client';

import { useState } from 'react';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { getStates, getDistricts } from '@/lib/locations';

interface LocationInputProps {
  value: {
    state: string;
    district: string;
    locality: string;
  };
  onChange: (location: { state: string; district: string; locality: string }) => void;
  required?: boolean;
  errors?: {
    state?: string;
    district?: string;
    locality?: string;
  };
}

export function LocationInput({ value, onChange, required, errors }: LocationInputProps) {
  const states = getStates();
  const districts = value.state ? getDistricts(value.state) : [];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      state: e.target.value,
      district: '',
      locality: value.locality,
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      district: e.target.value,
    });
  };

  const handleLocalityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      locality: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <Select
        label="State"
        required={required}
        value={value.state}
        onChange={handleStateChange}
        error={errors?.state}
        options={[
          { value: '', label: 'Select State' },
          ...states.map((state) => ({ value: state, label: state })),
        ]}
      />

      <Select
        label="District"
        required={required}
        value={value.district}
        onChange={handleDistrictChange}
        error={errors?.district}
        disabled={!value.state}
        options={[
          { value: '', label: 'Select District' },
          ...districts.map((district) => ({ value: district, label: district })),
        ]}
      />

      <Input
        label="Locality"
        required={required}
        value={value.locality}
        onChange={handleLocalityChange}
        error={errors?.locality}
        placeholder="e.g., Koramangala 5th Block, MG Road, etc."
      />
    </div>
  );
}
