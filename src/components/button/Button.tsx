import classNames from "classnames";
import React, { ReactNode } from "react";

import styles from "./button.module.scss";
import { BUTTON_SIZE_ENUM, BUTTON_VARIANT_ENUM } from "@/shared/enums";

interface IButton {
  title?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "tertiary" | "text" | "white";
  line?: boolean;
  children?: ReactNode;
  block?: boolean;
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  size?: "small" | "large";
  disabled?: boolean;
  loading?: boolean;
  spinnerClass?: string;
  isPublic?: boolean;
}

const Button: React.FC<IButton> = (props) => {
  const {
    title,
    variant = BUTTON_VARIANT_ENUM.Primary,
    disabled,
    className,
    children,
    onClick,
    block,
    line,
    type = "button",
    size = BUTTON_SIZE_ENUM.Default,
    loading = false,
    isPublic,
    icon
  } = props;

  const getSizeClass = {
    [BUTTON_SIZE_ENUM.Small]: styles.small,
    [BUTTON_SIZE_ENUM.Large]: styles.large,
    [BUTTON_SIZE_ENUM.Default]: styles.default,
  };

  const getVariantClass = {
    [BUTTON_VARIANT_ENUM.Primary]: styles.primary,
    [BUTTON_VARIANT_ENUM.Secondary]: styles.secondary,
    [BUTTON_VARIANT_ENUM.Tertiary]: styles.tertiary,
    [BUTTON_VARIANT_ENUM.Text]: styles.text,
    [BUTTON_VARIANT_ENUM.White]: styles.white,
  };

  const sizeClass = getSizeClass[size];
  const variantClass = getVariantClass[variant];

  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        styles.button,
        className,
        sizeClass,
        variantClass,
        styles.public,
        { [styles.block]: block },
        { [styles.line]: line && !isPublic }
      )}
      type={type}
    >
      {icon}
      {loading ? "loading..." : children}
    </button>
  );
};

export default Button;
