import Select, { components } from "react-select";
import * as R from 'ramda';

export const FilterBar = ({ filterOptions, filters, settings, setFilters, shortCss = false }) => {
    const MoreSelectedBadge = ({ items }) => {
        const title = items.join(", ");
        const length = items.length;
        const label = `+ ${length} selected`;

        return (
            <div title={title}>
                {label}
            </div>
        );
    };

    const MultiValue = ({ index, getValue, ...props }) => {
        const maxToShow = 2;
        const overflow = getValue()
            .slice(maxToShow)
            .map((x) => x.label);

        return index < maxToShow ? (
            <components.MultiValue {...props} />
        ) : index === maxToShow ? (
            <MoreSelectedBadge items={overflow} />
        ) : null;
    };


    const CustomOption = (props) => {
        return (
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    style={{ marginRight: 10 }}
                    readOnly
                />
                {props.data.label}
            </components.Option>
        );
    };

    return <Select
        options={filterOptions}
        value={filters}
        onChange={(val) => setFilters(val)}
        isMulti
        isSearchable
        placeholder="Filter by..."
        className={(shortCss ? 'search-short-length ' : '') + (settings.darkmode ? 'input-dark-mode' : '')}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        noOptionsMessage={({ inputValue }) => !R.isEmpty(inputValue) ? `No result found for "${inputValue}"` : undefined}
        components={filters.length >= 2 ? {
            Option: CustomOption,
            MultiValue: MultiValue
        } : { Option: CustomOption }}
    />
}