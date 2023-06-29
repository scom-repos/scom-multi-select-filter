/// <amd-module name="@scom/scom-multi-select-filter/store/interface.ts" />
declare module "@scom/scom-multi-select-filter/store/interface.ts" {
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
        type: 'checkbox' | 'radio';
        options: (IRadioOptions | ICheckboxOptions)[];
        expanded?: boolean;
    }
    export interface ICheckboxFilterData extends IFilterData {
        key: string;
    }
    export interface ICustomRadio {
        type: 'number' | 'text';
        placeholder?: [string?, string?];
    }
    export interface IRadioFilterData extends IFilterData {
        key: [string?, string?];
        tag: [string?, string?];
        custom?: ICustomRadio;
    }
}
/// <amd-module name="@scom/scom-multi-select-filter/store/index.ts" />
declare module "@scom/scom-multi-select-filter/store/index.ts" {
    export { ICheckboxFilterData, ICheckboxOptions, ICustomRadio, IFilterData, IOptions, IRadioFilterData, IRadioOptions } from "@scom/scom-multi-select-filter/store/interface.ts";
}
/// <amd-module name="@scom/scom-multi-select-filter/index.css.ts" />
declare module "@scom/scom-multi-select-filter/index.css.ts" {
    export const collaspeStyle: string;
}
/// <amd-module name="@scom/scom-multi-select-filter" />
declare module "@scom/scom-multi-select-filter" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    import { ICheckboxFilterData, IRadioFilterData } from "@scom/scom-multi-select-filter/store/index.ts";
    export { ICheckboxFilterData, IRadioFilterData };
    type FilterChangedCallback = (filters: {
        [key: string]: string[];
    }) => void;
    interface MultiSelectFilterElement extends ControlElement {
        data?: (ICheckboxFilterData | IRadioFilterData)[];
        onFilterChanged?: FilterChangedCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-multi-select-filter']: MultiSelectFilterElement;
            }
        }
    }
    export default class ScomMultiSelectFilter extends Module {
        private pnlFilter;
        private btnClear;
        private _filter;
        private _data;
        private checkboxesMapper;
        private radioGroupMapper;
        private customInputMapper;
        onFilterChanged: FilterChangedCallback;
        get filter(): {
            [key: string]: string[];
        };
        set filter(data: {
            [key: string]: string[];
        });
        set data(data: (ICheckboxFilterData | IRadioFilterData)[]);
        static create(options?: MultiSelectFilterElement, parent?: Container): Promise<ScomMultiSelectFilter>;
        constructor(parent?: Container, options?: MultiSelectFilterElement);
        private toggle;
        private updateFilters;
        private clearFilters;
        private toggleClearButton;
        private renderFilters;
        private renderRadioFilters;
        private renderCustomFields;
        private applyCustomRadio;
        private renderRadios;
        private onRadioChanged;
        private renderCheckboxes;
        private renderCheckboxFilters;
        private _updateSubFilter;
        private onSelectAll;
        private onSelectCheckbox;
        init(): void;
        render(): any;
    }
}
