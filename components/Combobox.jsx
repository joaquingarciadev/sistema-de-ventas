import { useEffect, useRef, useState } from "react";

/**
 * STYLES
 */
/* 
.combobox {
  position: relative;
  z-index: 1;
}

.combobox-input {
  position: relative;
  display: flex;
  flex-direction: column;
}

.combobox-btn {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  font-size: 10px;
  cursor: pointer;
}

.combobox-options {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow: auto;
}

.combobox-option {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-top: none;
  cursor: pointer;
}

.combobox-option.active {
  background: #f5f5f5;
}

.combobox-option:hover {
  filter: brightness(0.9);
}

.combobox-option:active {
  filter: brightness(0.8);
}
*/

export default function Combobox({ options, onChange, reset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [activeIndex, setActiveIndex] = useState(-1);

  const comboboxRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!comboboxRef?.current?.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [comboboxRef]);

  useEffect(() => {
    if (input === "") {
      setSelectedOption(null);
      showAllOptions();
      return;
    }
    const newOptions = options.filter((option) =>
      new RegExp(input, "i").test(option.label)
    );
    const newActiveIndex = newOptions.findIndex(
      (option) => option.label === selectedOption?.label
    );
    setFilteredOptions(newOptions);
    setActiveIndex(newActiveIndex);
  }, [options, input, selectedOption]);

  useEffect(() => {
    if (isOpen) inputRef.current.focus();
    if (input === "" || input === selectedOption?.label) showAllOptions();
    if (selectedOption) setInput(selectedOption.label);
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex > -1) {
      optionsRef?.current?.children[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (reset) handleReset();
  }, [reset]);

  const showAllOptions = () => {
    const newOptions = options;
    const newActiveIndex = newOptions.findIndex(
      (option) => option.label === selectedOption?.label
    );
    setFilteredOptions(newOptions);
    setActiveIndex(newActiveIndex);
  };

  const handleOptionSelect = (option) => {
    setInput(option.label);
    setSelectedOption(option);
    setIsOpen(false);

    if (onChange) onChange(option);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" || event.key === "Tab") return setIsOpen(false);
    if (!isOpen) return setIsOpen(true);
    if (event.key === "ArrowUp" && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (
      event.key === "ArrowDown" &&
      activeIndex < filteredOptions.length - 1
    ) {
      setActiveIndex(activeIndex + 1);
    } else if (event.key === "Enter" && activeIndex > -1) {
      handleOptionSelect(filteredOptions[activeIndex]);
    }
  };

  const handleReset = () => {
    setInput("");
    setSelectedOption(null);
    showAllOptions();
  };

  return (
    <div className="combobox" ref={comboboxRef}>
      <div className="combobox-input">
        <input
          type="text"
          name="combobox"
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          // onBlur={() => {
          //   setTimeout(() => {
          //     if (isOpen) setIsOpen(false);
          //   }, 300);
          // }}
          onKeyDown={handleKeyDown}
          required
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <div
          className="combobox-btn"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "\u25B2" : "\u25BC"}
        </div>
      </div>
      <div className={isOpen ? "combobox-options show" : "combobox-options"}
      ref={optionsRef}>
        {filteredOptions.map((option, index) => (
          <div
            key={option.label}
            className={
              activeIndex === index
                ? "combobox-option active"
                : "combobox-option"
            }
            onClick={() => {
              handleOptionSelect(option);
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
