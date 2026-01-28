import { Chip, Autocomplete, TextField } from '@mui/material';
import "./chips.scss";

interface ChipsProps {
  placeholder?: string,
  onChangeHandler?: any,
  name?: string,
  value?: string
}

const SharedChips:React.FC<ChipsProps> = ({placeholder, onChangeHandler, name, value}) => {

  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
              <Chip size="small" variant="outlined" label={option} key={key} {...tagProps} />
              );
          })
      }
      renderInput={(params) => (
      <TextField
          {...params}
          size="small"
          placeholder={placeholder}
          onChange={onChangeHandler}
          name={name}
          value={value}
      />
      )}
    />
  );
};

export default SharedChips;
