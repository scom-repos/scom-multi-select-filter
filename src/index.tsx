import {
  customElements,
  ControlElement,
  customModule,
  Module,
  Panel,
  Checkbox,
  RadioGroup,
  Input,
  Control,
  Icon,
  Styles,
  Container,
  Button
} from '@ijstech/components';
import {
  ICheckboxFilterData,
  ICheckboxOptions,
  ICustomRadio,
  IOptions,
  IRadioFilterData,
  IRadioOptions
} from './store/index';
export { ICheckboxFilterData, IRadioFilterData }
import { collaspeStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;

type FilterChangedCallback = (filters: { [key: string]: string[] }) => void;

interface RadioItem extends ControlElement {
  caption: string;
  captionWidth?: number | string;
  value?: string;
}

interface MultiSelectFilterElement extends ControlElement {
  data?: (ICheckboxFilterData | IRadioFilterData)[],
  onFilterChanged?: FilterChangedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-multi-select-filter']: MultiSelectFilterElement
    }
  }
}

@customModule
@customElements('i-scom-multi-select-filter')
export default class ScomMultiSelectFilter extends Module {
  private pnlFilter: Panel;
  private _filter: { [key: string]: string[] } = {};
  private _data: (ICheckboxFilterData | IRadioFilterData)[];
  private checkboxesMapper: Map<string, Checkbox> = new Map();
  private radioGroupMapper: Map<string, RadioGroup> = new Map();
  private customInputMapper: Map<string, Input> = new Map();
  private clearButtonMapper: Map<string, Button> = new Map();
  public onFilterChanged: FilterChangedCallback;

  get filter(): { [key: string]: string[] } {
    return this._filter;
  }

  set filter(data: { [key: string]: string[] }) {
    this._filter = data;
    this.updateFilters();
    this.toggleClearButton();
  }

  set data(data: (ICheckboxFilterData | IRadioFilterData)[]) {
    this._data = data;
    this.renderFilters();
  }

  static async create(options?: MultiSelectFilterElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: MultiSelectFilterElement) {
    super(parent, options);
  }

  private toggle(container: Control, icon: Icon) {
    container.visible = !container.visible;
    icon.classList.toggle('rotate-icon');
  }

  private updateFilters = () => {
    [...this.radioGroupMapper.keys()].forEach(_k => {
      const radioGroup = this.radioGroupMapper.get(_k);
      if (this._filter[_k]) {
        radioGroup.selectedValue = (radioGroup.tag ?? []).findIndex((opt: IRadioOptions) => {
          return this._filter[_k]?.[0] === opt.value;
        }).toString();
      } else {
        radioGroup.selectedValue = '';
      }
      if (this.customInputMapper.has(_k)) {
        const input = this.customInputMapper.get(_k);
        input.value = _k ? this._filter[_k]?.[0] ?? "" : "";
      }
    });
    this.checkboxesMapper.forEach((checkbox, key) => {
      const arr = key.split('|');
      const value = this._filter[arr[0]];
      checkbox.checked = value && (value.includes(arr[1]) || value.includes(arr[2]));
    })
  }

  private clearFilters(key: string) {
    const filter = JSON.parse(JSON.stringify(this.filter));
    if (filter) delete filter[key];
    this.filter = filter;
    if (this.onFilterChanged) this.onFilterChanged(this._filter);
  }

  private toggleClearButton() {
    [...this.clearButtonMapper.keys()].forEach(_k => {
      const button = this.clearButtonMapper.get(_k);
      button.visible = this._filter && this._filter[_k]?.length > 0;
    });
  }

  private renderFilters = () => {
    if (!this.pnlFilter) return;
    this.pnlFilter.clearInnerHTML();
    this.checkboxesMapper.clear();
    this.radioGroupMapper.clear();
    this.customInputMapper.clear();
    this.clearButtonMapper.clear();
    this._data.forEach((data) => {
      const filters = data.type === 'checkbox' ?
        this.renderCheckboxFilters(data as ICheckboxFilterData) : this.renderRadioFilters(data as IRadioFilterData);
      const icon = (
        <i-icon
          position="absolute"
          right={0}
          width={24}
          height={24}
          class={`${data.expanded ? 'rotate-icon' : ''} pointer icon-filter--chevron`}
          name="chevron-down"
          fill={Theme.text.primary}
          padding={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onClick={(src: Icon) => this.toggle(filters, src)} 
        />
      );
      const clearButton = (
        <i-button
          caption="Clear"
          opacity={0.5}
          padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
          margin={{ left: 'auto' }}
          border={{ width: 1, style: 'solid', color: Theme.colors.secondary.light, radius: 4 }}
          background={{ color: 'transparent' }}
          font={{ color: Theme.text.primary, size: '0.75rem' }}
          icon={{ name: 'times-circle', fill: Theme.text.primary, width: 12, height: 12 }}
          visible={!!Object.keys(this.filter).length}
          onClick={() => this.clearFilters(data.key)}
        />
      );
      this.clearButtonMapper.set(data.key, clearButton);
      this.pnlFilter.append(
        <i-panel class={collaspeStyle}>
          <i-hstack
            position="relative"
            verticalAlignment="center"
            horizontalAlignment="space-between"
            padding={{ top: '0.5rem', right: '2.25rem', bottom: '0.5rem', left: '1rem' }}
            border={{ radius: 5, bottom: { width: '1px', style: 'solid', color: Theme.text.primary } }}
            gap="8px"
            minHeight={41}
            class="filter-collapse"
          >
            <i-label font={{ bold: true }} caption={data.name} />
            {clearButton}
            {icon}
          </i-hstack>
          <i-panel
            width="calc(100% - 1rem)"
            margin={{ left: 'auto' }}
            border={{ bottom: { width: '1px', style: 'solid', color: Theme.divider } }}
          />
          {filters}
        </i-panel>
      );
    })
  }

  private renderRadioFilters = (data: IRadioFilterData) => {
    const options = data.options as IRadioOptions[];
    const radioGroup = this.renderRadios(data.key, options, data.custom);
    const customFields = data.custom ? this.renderCustomFields(data, radioGroup) : [];
    return (
      <i-vstack
        visible={!!data.expanded}
        margin={{ top: '1rem', bottom: '1rem' }}
        padding={{ bottom: '1.5rem' }}
        gap="0.75rem"
      >
        {radioGroup}
        {customFields}
      </i-vstack>
    );
  }

  private renderCustomFields(data: IRadioFilterData, radioGroup: RadioGroup) {
    const input: Input = (
      <i-input
        width="100%"
        height={40}
        border={{ radius: 8 }}
        placeholder={data.custom.placeholder ?? ''}
        inputType={data.custom.type}
        value={radioGroup.selectedValue == '' ? this._filter[data.key]?.[0] ?? '' : ''}
        onFocus={() => {
          if (radioGroup.selectedValue != '')
            radioGroup.selectedValue = '';
        }}
      />
    )
    this.customInputMapper.set(data.key.toString(), input);
    return (
      <i-vstack class="radio-custom" gap="0.75rem" padding={{ left: '1rem', right: '1rem' }}>
        <i-hstack gap="0.5rem" verticalAlignment="center">
          {input}
        </i-hstack>
        <i-button
          width="100%"
          caption="Apply"
          font={{ color: Theme.colors.primary.contrastText }}
          padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
          onClick={() => {
            if (radioGroup.selectedValue === '')
              this.applyCustomRadio(data.key, input)
          }}
        />
      </i-vstack>
    )
  }

  private applyCustomRadio = (key: string, input: Input) => {
    const inputValue = input.value;
    if (!inputValue) {
      return;
    }
    if (inputValue)
      this._filter[key] = [inputValue];
    else
      delete this._filter[key];
    this.toggleClearButton();
    if (this.onFilterChanged) this.onFilterChanged(this._filter)
  }

  private renderRadios(key: string, options: IRadioOptions[], custom?: ICustomRadio) {
    let selectedValue: string | undefined = '';
    const items: RadioItem[] = options.map((opt, idx) => {
      if (this._filter[key]?.[0] === opt.value) {
        selectedValue = idx.toString();
      }
      return {
        caption: opt.label,
        value: idx.toString(),
        width: '100%',
        height: 'auto',
        captionWidth: 'auto'
      }
    });
    if (custom)
      items.push({
        caption: 'Custom',
        value: '',
        width: '100%',
        height: 'auto',
        captionWidth: 'auto'
      })
    const radioGroup = (
      <i-radio-group
        width="100%"
        display="flex"
        padding={{ left: '1rem' }}
        radioItems={items}
        onChanged={(target) => this.onRadioChanged(target as RadioGroup, key, options)}
        selectedValue={selectedValue}
        tag={options}
      />
    );
    this.radioGroupMapper.set(key, radioGroup);
    return radioGroup;
  }

  private onRadioChanged = (target: RadioGroup, key: string, options: IRadioOptions[]) => {
    if (target.selectedValue === '') return;
    const option: IRadioOptions = options[target.selectedValue];
    if (option.isAll) {
      if (this._filter[key])
        delete this._filter[key];
    } else {
      if (option.value)
        this._filter[key] = [option.value];
      else
        delete this._filter[key];
    }
    this.toggleClearButton();
    if (this.onFilterChanged) this.onFilterChanged(this._filter);
  }

  private renderCheckboxes(filterKey: string, options: ICheckboxOptions[], isParent: boolean, keyPrefix?: string) {
    const checkboxes: Control[] = [];
    for (const opt of options) {
      const key = `${keyPrefix ? keyPrefix + '|' : ''}${opt.value}`;
      const subCheckboxes = opt.subCheckbox?.length ? this.renderCheckboxes(filterKey, opt.subCheckbox, false, key) : [];
      const checked = this._filter[filterKey] && (this._filter[filterKey].includes(opt.value) || this._filter[filterKey].includes(keyPrefix));
      const checkbox = (
        <i-checkbox
          height="auto"
          class={isParent ? 'parentcheckbox' : 'subcheckbox'}
          caption={opt.label}
          checked={checked ?? false}
          margin={{ bottom: isParent ? '4px' : '0', left: isParent ? '1rem' : 0 }}
          onChanged={(source: Control, event: Event) => {
            const _checkbox = source as Checkbox;
            if (isParent)
              this.onSelectAll(filterKey, `${filterKey}|${key}`, opt, _checkbox.checked);
            else
              this.onSelectCheckbox(filterKey, keyPrefix, opt, options, _checkbox.checked);
          }}
        />
      );
      this.checkboxesMapper.set(`${filterKey}|${key}`, checkbox)
      checkboxes.push(
        <i-vstack margin={{ left: isParent ? 0 : '1rem' }} stack={{ basis: '100%' }} gap="4px">
          {checkbox}
          {subCheckboxes}
        </i-vstack>
      )
    }
    return checkboxes;
  }

  private renderCheckboxFilters = (data: ICheckboxFilterData) => {
    const options = data.options as ICheckboxOptions[];
    const checkboxes = this.renderCheckboxes(data.key, options, true);
    const hasSubCheckbox = options.some(opt => opt.subCheckbox?.length > 0);
    return (
      <i-vstack
        visible={!!data.expanded}
        margin={{ top: '1rem' }}
        padding={{ bottom: '1rem' }}
        gap={ hasSubCheckbox ? "1.25rem" : "4px" }
      >
        {checkboxes}
      </i-vstack>
    );
  }

  private _updateSubFilter = (filterKey: string, options: IOptions[], selectAll: boolean, curValue?: any) => {
    if (options) {
      if (selectAll && options.length <= 1) return;
      options.forEach(opt => {
        if (selectAll) {
          const idx = this._filter[filterKey].indexOf(opt.value);
          if (idx >= 0) {
            this._filter[filterKey].splice(idx, 1);
          }
        } else {
          if (curValue === opt.value) return;
          this._filter[filterKey].push(opt.value)
        }
      })
    }
  }

  private onSelectAll = (filterKey: string, checkboxKey: string, option: ICheckboxOptions, checked: boolean) => {
    const keys = [...this.checkboxesMapper.keys()].filter(k => k !== checkboxKey && k.startsWith(checkboxKey));
    keys.forEach(_k => {
      if (!this.checkboxesMapper.has(_k)) return;
      this.checkboxesMapper.get(_k).checked = checked;
    })
    if (!this._filter[filterKey]) this._filter[filterKey] = [];
    const index = this._filter[filterKey].indexOf(option.value);
    if (checked && index == -1) {
      this._filter[filterKey].push(option.value)
      this._updateSubFilter(filterKey, option.subCheckbox, true);
    } else if (!checked && index >= 0) {
      this._filter[filterKey].splice(index, 1);
    }
    this.toggleClearButton();
    if (this.onFilterChanged) this.onFilterChanged(this._filter);
  }

  private onSelectCheckbox = (filterKey: string, parentKey: string, curOption: ICheckboxOptions, options: IOptions[], checked: boolean) => {
    if (!this._filter[filterKey]) this._filter[filterKey] = [];
    const parentIndex = this._filter[filterKey].indexOf(parentKey);
    const _mapKey = `${filterKey}|${parentKey}`;
    const index = this._filter[filterKey].indexOf(curOption.value);
    const keys = [...this.checkboxesMapper.keys()].filter(k => k !== _mapKey && k.startsWith(_mapKey));
    if (checked) {
      const isAllChecked = keys.every(_k => this.checkboxesMapper.get(_k).checked);
      if (isAllChecked) {
        if (this.checkboxesMapper.has(_mapKey)) {
          this.checkboxesMapper.get(_mapKey).checked = true;
        }
        this._filter[filterKey].push(parentKey);
        this._updateSubFilter(filterKey, options, true);
      } else if (index == -1) {
        this._filter[filterKey].push(curOption.value)
      }
    } else {
      if (index >= 0) {
        this._filter[filterKey].splice(index, 1);
      }
      if (parentIndex >= 0) {
        this._filter[filterKey].splice(parentIndex, 1);
      }
      if (this.checkboxesMapper.has(_mapKey)) {
        if (this.checkboxesMapper.get(_mapKey).checked) {
          this._updateSubFilter(filterKey, options, false, curOption.value);
        }
        this.checkboxesMapper.get(_mapKey).checked = false;
      }
    }
    this.toggleClearButton();
    if (this.onFilterChanged) this.onFilterChanged(this._filter);
  }

  init() {
    super.init();
    const data = this.getAttribute('data', true);
    if (data) {
      this.data = data;
    }
    const onFilterChanged = this.getAttribute('onFilterChanged', true);
    if (onFilterChanged) {
      this.onFilterChanged = onFilterChanged;
    }
  }

  render() {
    return (
      <i-panel id="pnlFilter" padding={{ bottom: '1rem' }} />
    )
  }
}
