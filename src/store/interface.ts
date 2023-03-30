export interface IOptions {
  label: string;
  value: string;
}

export interface IRadioOptions {
  label: string;
  value?: [string?, string?];
  isAll?: boolean;
}

export interface ICheckboxOptions extends IOptions {
  subCheckbox?: IOptions[];
}

export interface IFilterData {
  name: string;
  type: 'checkbox' | 'radio',
  options: (IRadioOptions | ICheckboxOptions)[];
  expanded?: boolean;
}

export interface ICheckboxFilterData extends IFilterData {
  key: string;
}

export interface ICustomRadio {
  type: 'number' | 'text',
  placeholder?: [string?, string?];
}

export interface IRadioFilterData extends IFilterData {
  key: [string?, string?];
  tag: [string?, string?];
  custom?: ICustomRadio;
}
