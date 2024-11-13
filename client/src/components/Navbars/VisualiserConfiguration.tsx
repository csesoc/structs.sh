import { VisualizerType } from 'visualiser-debugger/Types/visualizerType';
import { useState } from 'react';
import Select from 'components/Select';
import { SelectItem } from 'components/Select/Select';
import styles from 'styles/Configuration.module.css';

const VisualiserConfiguration = ({
  fields,
  handleUpdateAnnotation,
}: {
  fields: { name: VisualizerType }[];
  handleUpdateAnnotation: (name: VisualizerType) => void;
}) => {
  const [value, setValue] = useState(fields[0]?.name);

  const handleValueChange = (newValue: VisualizerType) => {
    const foundField = fields.find((field) => field.name === newValue);
    if (!foundField) {
      console.error('Field not found');
      return;
    }
    setValue(newValue);
    handleUpdateAnnotation(foundField.name);
  };

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      placeholder="Select annotation..."
      triggerClassName={styles.monospaceFont}
    >
      {fields.map((field, index: number) => (
        <SelectItem className={styles.monospaceFont} value={field.name} key={index}>
          {field.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default VisualiserConfiguration;
