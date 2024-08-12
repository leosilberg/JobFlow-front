import { useEffect, useState } from "react";

export default function Editable({
  text,
  placeholder,
  children,
  inputRef,
  onChange,
  ...props
}: any) {
  const [isEditing, setEditing] = useState(false);

  // Event handler while pressing any key while editing
  const handleKeyDown = (event: any) => {
    // Handle when key is pressed
  };

  const handleBlur = () => {
    setEditing(false);
    if (text !== inputRef.current.value) {
      onChange({ [inputRef.current.name]: inputRef.current.value });
    }
  };

  useEffect(() => {
    if (inputRef.current && isEditing === true) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  return (
    <>
      {isEditing ? (
        <div onBlur={handleBlur} onKeyDown={(e) => handleKeyDown(e)}>
          {children}
        </div>
      ) : (
        <div onClick={() => setEditing(true)}>
          <span>{text || placeholder || "Editable content"}</span>
        </div>
      )}
    </>
  );
}
