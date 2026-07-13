/* @ds-bundle: {"format":4,"namespace":"InfiniumDesignSystem_292503","components":[{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/display/Badge.jsx":"8b8c5505fc44","components/display/Card.jsx":"a644deb90ebc","components/display/Tag.jsx":"d0c324398ef7","components/feedback/Dialog.jsx":"8a8d5ee9cec0","components/feedback/Toast.jsx":"a91f28e1e985","components/feedback/Tooltip.jsx":"98f96e9ab945","components/forms/Button.jsx":"31b8ac8de471","components/forms/Checkbox.jsx":"8f066b9e0d8b","components/forms/IconButton.jsx":"e9ab7361823d","components/forms/Input.jsx":"e069b9e07141","components/forms/Radio.jsx":"5c9adf4497b0","components/forms/Select.jsx":"8ab2f07f4d13","components/forms/Switch.jsx":"8191a1dbed89","components/navigation/Tabs.jsx":"118a928b6ff7","ui_kits/website/app.jsx":"c52d3872aaf2","ui_kits/website/sections.jsx":"7c9543fe5ab0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.InfiniumDesignSystem_292503 = window.InfiniumDesignSystem_292503 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Badge.jsx
try { (() => {
const tones = {
  neutral: {
    bg: 'var(--ink-100)',
    fg: 'var(--ink-700)'
  },
  accent: {
    bg: 'var(--accent-subtle)',
    fg: 'var(--blue-700)'
  },
  positive: {
    bg: 'var(--status-positive-bg)',
    fg: 'var(--status-positive)'
  },
  caution: {
    bg: 'var(--status-caution-bg)',
    fg: 'var(--status-caution)'
  },
  critical: {
    bg: 'var(--status-critical-bg)',
    fg: 'var(--status-critical)'
  }
};
function Badge({
  tone = 'neutral',
  dot = false,
  children,
  style
}) {
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.fg,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
const {
  useState
} = React;
function Card({
  eyebrow,
  title,
  children,
  footer,
  hoverable = false,
  padding = 24,
  onClick,
  style
}) {
  const [hover, setHover] = useState(false);
  const lifted = hoverable && hover;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: lifted ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transition: 'box-shadow var(--duration-base) var(--ease-out)',
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-eyebrow)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--style-h4)',
      color: 'var(--text-heading)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--style-body)',
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 8
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
const {
  useState
} = React;
function Tag({
  children,
  onRemove,
  interactive = false,
  selected = false,
  onClick,
  style
}) {
  const [hover, setHover] = useState(false);
  const active = selected || interactive && hover;
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      background: selected ? 'var(--accent-subtle)' : 'var(--surface-card)',
      border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-default)'}`,
      color: selected ? 'var(--blue-700)' : 'var(--text-body)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      cursor: interactive || onClick ? 'pointer' : 'default',
      transition: 'border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      border: 'none',
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      color: 'var(--ink-400)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "13",
    height: "13",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6 6 18"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = false,
  title,
  children,
  footer,
  onClose,
  width = 480
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(11, 14, 20, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      width,
      maxWidth: 'calc(100vw - 48px)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-body)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--style-h4)',
      color: 'var(--text-heading)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Close",
    onClick: onClose,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--ink-500)',
      padding: 4,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6 6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 24px 20px',
      font: 'var(--style-body)',
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '14px 24px',
      background: 'var(--surface-subtle)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const toneMap = {
  neutral: {
    border: 'var(--border-default)',
    icon: 'var(--ink-500)'
  },
  positive: {
    border: 'var(--status-positive)',
    icon: 'var(--status-positive)'
  },
  caution: {
    border: 'var(--status-caution)',
    icon: 'var(--status-caution)'
  },
  critical: {
    border: 'var(--status-critical)',
    icon: 'var(--status-critical)'
  }
};
const icons = {
  neutral: /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }),
  positive: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m8.5 12.5 2.5 2.5 4.5-5"
  })),
  caution: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3 2.5 20h19L12 3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 10v4M12 17.5v.1"
  })),
  critical: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v5M12 16.5v.1"
  }))
};
function Toast({
  tone = 'neutral',
  title,
  description,
  onDismiss,
  style
}) {
  const t = toneMap[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      width: 360,
      padding: '14px 16px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "20",
    height: "20",
    fill: "none",
    stroke: t.icon,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      marginTop: 1
    }
  }, icons[tone]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-heading)'
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-snug)'
    }
  }, description)), onDismiss && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Dismiss",
    onClick: onDismiss,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--ink-400)',
      padding: 2,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6 6 18"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  content,
  side = 'top',
  children
}) {
  const [show, setShow] = useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%, -6px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translate(-50%, 6px)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translate(-6px, -50%)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translate(6px, -50%)'
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      zIndex: 50,
      ...pos,
      background: 'var(--ink-900)',
      color: 'var(--white)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1.4,
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-md)',
      pointerEvents: 'none'
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const {
  useState
} = React;
const sizes = {
  sm: {
    padding: '6px 14px',
    fontSize: 'var(--text-sm)',
    height: 32
  },
  md: {
    padding: '9px 18px',
    fontSize: 'var(--text-base)',
    height: 40
  },
  lg: {
    padding: '12px 24px',
    fontSize: 'var(--text-md)',
    height: 48
  }
};
const variantStyles = (hover, active) => ({
  primary: {
    background: active ? 'var(--accent-active)' : hover ? 'var(--accent-hover)' : 'var(--accent)',
    color: 'var(--text-on-accent)',
    border: '1px solid transparent'
  },
  secondary: {
    background: hover ? 'var(--surface-subtle)' : 'var(--surface-card)',
    color: 'var(--text-heading)',
    border: '1px solid var(--border-default)'
  },
  ghost: {
    background: hover ? 'var(--accent-subtle)' : 'transparent',
    color: 'var(--accent)',
    border: '1px solid transparent'
  },
  danger: {
    background: active ? '#8F2E2E' : hover ? '#9E3434' : 'var(--red-600)',
    color: 'var(--white)',
    border: '1px solid transparent'
  }
});
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft,
  iconRight,
  onClick,
  children,
  style
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);
  const v = variantStyles(hover && !disabled, active && !disabled)[variant];
  const s = sizes[size];
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-medium)',
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      outline: 'none',
      whiteSpace: 'nowrap',
      ...s,
      ...v,
      ...style
    }
  }, iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
const {
  useState
} = React;
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  style
}) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(!isOn);
    onChange && onChange(!isOn);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    role: "checkbox",
    "aria-checked": isOn,
    onClick: toggle,
    disabled: disabled,
    style: {
      width: 18,
      height: 18,
      flexShrink: 0,
      padding: 0,
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isOn ? 'var(--accent)' : 'var(--surface-card)',
      border: `1px solid ${isOn ? 'var(--accent)' : 'var(--border-strong)'}`,
      cursor: 'inherit',
      transition: 'background var(--duration-fast) var(--ease-out)'
    }
  }, isOn && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "12",
    height: "12",
    fill: "none",
    stroke: "white",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5 13 4 4L19 7"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
const {
  useState
} = React;
const dims = {
  sm: 32,
  md: 40,
  lg: 48
};
function IconButton({
  variant = 'secondary',
  size = 'md',
  disabled = false,
  'aria-label': ariaLabel,
  onClick,
  children,
  style
}) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const h = hover && !disabled;
  const looks = {
    primary: {
      background: h ? 'var(--accent-hover)' : 'var(--accent)',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent'
    },
    secondary: {
      background: h ? 'var(--surface-subtle)' : 'var(--surface-card)',
      color: 'var(--ink-700)',
      border: '1px solid var(--border-default)'
    },
    ghost: {
      background: h ? 'var(--accent-subtle)' : 'transparent',
      color: 'var(--ink-600)',
      border: '1px solid transparent'
    }
  };
  const d = dims[size];
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": ariaLabel,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: d,
      height: d,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--duration-fast) var(--ease-out)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      outline: 'none',
      ...looks[variant],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
const {
  useState
} = React;
function Input({
  label,
  placeholder,
  type = 'text',
  value,
  defaultValue,
  onChange,
  helper,
  error,
  disabled = false,
  style
}) {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? 'var(--status-critical)' : focus ? 'var(--border-accent)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-heading)'
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      height: 40,
      padding: '0 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-heading)',
      background: disabled ? 'var(--surface-subtle)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focus && !error ? 'var(--focus-ring)' : 'none',
      transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
      opacity: disabled ? 0.6 : 1,
      width: '100%',
      boxSizing: 'border-box'
    }
  }), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--status-critical)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  name,
  options = [],
  value,
  onChange,
  direction = 'column',
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'column' ? 10 : 20,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    const isOn = value === opt.value;
    return /*#__PURE__*/React.createElement("label", {
      key: opt.value,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement("button", {
      role: "radio",
      "aria-checked": isOn,
      disabled: disabled,
      onClick: () => !disabled && onChange && onChange(opt.value),
      style: {
        width: 18,
        height: 18,
        flexShrink: 0,
        padding: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-card)',
        border: `1px solid ${isOn ? 'var(--accent)' : 'var(--border-strong)'}`,
        cursor: 'inherit',
        transition: 'border-color var(--duration-fast) var(--ease-out)'
      }
    }, isOn && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--accent)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, opt.label));
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState
} = React;
function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  style
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-heading)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    defaultValue: defaultValue ?? (placeholder ? '' : undefined),
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      height: 40,
      padding: '0 36px 0 12px',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-heading)',
      background: disabled ? 'var(--surface-subtle)' : 'var(--surface-card)',
      border: `1px solid ${focus ? 'var(--border-accent)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      appearance: 'none',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1
    }
  }, placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "var(--ink-500)",
    strokeWidth: "1.5",
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
const {
  useState
} = React;
function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  style
}) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(!isOn);
    onChange && onChange(!isOn);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    role: "switch",
    "aria-checked": isOn,
    onClick: toggle,
    disabled: disabled,
    style: {
      width: 36,
      height: 20,
      flexShrink: 0,
      padding: 2,
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      background: isOn ? 'var(--accent)' : 'var(--ink-300)',
      cursor: 'inherit',
      display: 'flex',
      justifyContent: isOn ? 'flex-end' : 'flex-start',
      transition: 'background var(--duration-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: 'white',
      boxShadow: 'var(--shadow-sm)',
      transition: 'transform var(--duration-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const {
  useState
} = React;
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const [internal, setInternal] = useState(defaultValue ?? (tabs[0] && (typeof tabs[0] === 'string' ? tabs[0] : tabs[0].value)));
  const current = value !== undefined ? value : internal;
  const select = v => {
    if (value === undefined) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, tabs.map(t => {
    const tab = typeof t === 'string' ? {
      value: t,
      label: t
    } : t;
    const isOn = current === tab.value;
    return /*#__PURE__*/React.createElement(TabItem, {
      key: tab.value,
      isOn: isOn,
      onClick: () => select(tab.value)
    }, tab.label);
  }));
}
function TabItem({
  isOn,
  onClick,
  children
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": isOn,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      padding: '10px 16px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      fontWeight: isOn ? 'var(--weight-medium)' : 'var(--weight-regular)',
      color: isOn ? 'var(--accent)' : hover ? 'var(--text-heading)' : 'var(--text-muted)',
      boxShadow: isOn ? 'inset 0 -2px 0 var(--accent)' : 'none',
      transition: 'color var(--duration-fast) var(--ease-out)',
      marginBottom: -1
    }
  }, children);
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/app.jsx
try { (() => {
// Infinium website — insights, contact, footer + app shell
const DS2 = window.InfiniumDesignSystem_292503;
const {
  Button: Btn2,
  Tag: Tag2,
  Badge: Badge2,
  Input: Input2,
  Select: Select2,
  Checkbox: Checkbox2,
  Dialog: Dialog2,
  Toast: Toast2
} = DS2;
function Insights() {
  const all = [{
    tag: 'Risk',
    date: 'Jun 2026',
    title: 'DORA six months in: what supervisors are actually asking',
    mins: 6
  }, {
    tag: 'Payments',
    date: 'May 2026',
    title: 'Instant payments and the new liquidity discipline',
    mins: 4
  }, {
    tag: 'Transformation',
    date: 'May 2026',
    title: 'Why core migrations fail in year two — and how to avoid it',
    mins: 8
  }, {
    tag: 'Risk',
    date: 'Apr 2026',
    title: 'Model governance for AI-assisted credit decisioning',
    mins: 7
  }];
  const tags = ['All', 'Risk', 'Payments', 'Transformation'];
  const [filter, setFilter] = React.useState('All');
  const shown = all.filter(a => filter === 'All' || a.tag === filter);
  return /*#__PURE__*/React.createElement("section", {
    id: "insights",
    style: {
      padding: 'var(--section-pad) 0',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement(window.Wrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 36,
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.Eyebrow, null, "Insights"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--style-h2)',
      color: 'var(--text-heading)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, "Briefings from the field")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, tags.map(t => /*#__PURE__*/React.createElement(Tag2, {
    key: t,
    interactive: true,
    selected: filter === t,
    onClick: () => setFilter(t)
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 20
    }
  }, shown.map(a => /*#__PURE__*/React.createElement("a", {
    key: a.title,
    href: "#",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 24,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-sm)',
      height: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge2, {
    tone: "accent"
  }, a.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-caption)',
      color: 'var(--text-faint)'
    }
  }, a.date, " \xB7 ", a.mins, " min read")), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--weight-semibold) var(--text-lg)/1.35 var(--font-display)',
      color: 'var(--text-heading)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, a.title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--weight-medium) var(--text-sm)/1 var(--font-body)',
      color: 'var(--accent)',
      marginTop: 'auto'
    }
  }, "Read the briefing ", /*#__PURE__*/React.createElement(window.Icon, {
    name: "arrow-right",
    size: 15
  }))))))));
}
function Contact({
  onSent
}) {
  const [sent, setSent] = React.useState(false);
  const submit = () => {
    setSent(true);
    onSent && onSent();
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "about",
    style: {
      padding: 'var(--section-pad) 0',
      background: 'var(--surface-dark)'
    }
  }, /*#__PURE__*/React.createElement(window.Wrap, {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 460px',
      gap: 80,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(window.Eyebrow, {
    onDark: true
  }, "Contact"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--style-h2)',
      color: 'var(--white)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, "Start a conversation"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--style-body-lg)',
      color: 'rgba(255,255,255,0.65)',
      maxWidth: 460
    }
  }, "Tell us where you are \u2014 a supervisory finding, a transformation that has stalled, a decision that needs an outside view. We reply within one business day."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-caption)',
      color: 'rgba(255,255,255,0.5)'
    }
  }, "Infinium Consulting B.V."), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-caption)',
      color: 'rgba(255,255,255,0.5)'
    }
  }, "Amsterdam \xB7 contact@infinium.consulting"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 28,
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      alignItems: 'flex-start',
      padding: '24px 0'
    }
  }, /*#__PURE__*/React.createElement(Badge2, {
    tone: "positive",
    dot: true
  }, "Message sent"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--style-body)',
      color: 'var(--text-body)'
    }
  }, "Thank you. We will reply within one business day."), /*#__PURE__*/React.createElement(Btn2, {
    variant: "ghost",
    onClick: () => setSent(false)
  }, "Send another message")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Input2, {
    label: "Name",
    placeholder: "Your full name"
  }), /*#__PURE__*/React.createElement(Input2, {
    label: "Work email",
    placeholder: "name@company.com"
  }), /*#__PURE__*/React.createElement(Select2, {
    label: "Topic",
    placeholder: "Select a topic",
    options: ['Risk & compliance', 'Transformation', 'Operational excellence', 'Other']
  }), /*#__PURE__*/React.createElement(Checkbox2, {
    label: "Subscribe to regulatory briefings"
  }), /*#__PURE__*/React.createElement(Btn2, {
    onClick: submit
  }, "Send message")))));
}
function Footer() {
  const cols = [['Services', ['Regulatory change', 'Core banking migration', 'Operational excellence', 'Model & data governance']], ['Sectors', ['Retail & commercial banking', 'Payments & fintech', 'Asset & wealth management', 'Insurance']], ['Company', ['About', 'Insights', 'Careers', 'Contact']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink-950)',
      padding: '64px 0 40px'
    }
  }, /*#__PURE__*/React.createElement(window.Wrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr repeat(3, 200px)',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) 22px var(--font-display)',
      color: 'var(--white)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, "Infinium"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-caption)',
      color: 'rgba(255,255,255,0.45)',
      maxWidth: 260
    }
  }, "Advisory for banking and financial services. Amsterdam, The Netherlands.")), cols.map(([h, links]) => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-eyebrow)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.4)'
    }
  }, h), links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      font: 'var(--style-caption)',
      color: 'rgba(255,255,255,0.65)',
      textDecoration: 'none'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      paddingTop: 20,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-caption)',
      color: 'rgba(255,255,255,0.35)'
    }
  }, "\xA9 2026 Infinium Consulting B.V. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-caption)',
      color: 'rgba(255,255,255,0.35)'
    }
  }, "Privacy \xB7 Terms \xB7 KvK 000000"))));
}
function App() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const openContact = () => setDialogOpen(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.SiteNav, {
    onContact: openContact
  }), /*#__PURE__*/React.createElement(window.Hero, {
    onContact: openContact
  }), /*#__PURE__*/React.createElement(window.Services, null), /*#__PURE__*/React.createElement(window.Sectors, null), /*#__PURE__*/React.createElement(Insights, null), /*#__PURE__*/React.createElement(Contact, {
    onSent: () => {
      setToast(true);
      setTimeout(() => setToast(false), 4000);
    }
  }), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(Dialog2, {
    open: dialogOpen,
    title: "Start a conversation",
    onClose: () => setDialogOpen(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn2, {
      variant: "secondary",
      onClick: () => setDialogOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Btn2, {
      onClick: () => {
        setDialogOpen(false);
        setToast(true);
        setTimeout(() => setToast(false), 4000);
      }
    }, "Send"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement(Input2, {
    label: "Work email",
    placeholder: "name@company.com"
  }), /*#__PURE__*/React.createElement(Select2, {
    label: "Topic",
    placeholder: "Select a topic",
    options: ['Risk & compliance', 'Transformation', 'Operational excellence', 'Other']
  }))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 200
    }
  }, /*#__PURE__*/React.createElement(Toast2, {
    tone: "positive",
    title: "Message sent",
    description: "We will reply within one business day.",
    onDismiss: () => setToast(false)
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/sections.jsx
try { (() => {
// Infinium website — shared sections (loaded via Babel; exported on window)
const DS = window.InfiniumDesignSystem_292503;
const {
  Button,
  IconButton,
  Badge,
  Tag,
  Card,
  Input,
  Select,
  Checkbox
} = DS;
const Icon = ({
  name,
  size = 20,
  color = 'currentColor',
  sw = 1.5
}) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          'stroke-width': sw,
          width: size,
          height: size
        },
        nameAttr: 'data-lucide'
      });
    }
  }, [name]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      color,
      width: size,
      height: size
    }
  });
};
const Wrap = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 'var(--container-max)',
    margin: '0 auto',
    padding: '0 var(--gutter)',
    ...style
  }
}, children);
const Eyebrow = ({
  children,
  onDark
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    font: 'var(--style-eyebrow)',
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    color: onDark ? 'var(--accent-on-dark)' : 'var(--accent)'
  }
}, children);
function SiteNav({
  onContact
}) {
  const links = ['Services', 'Sectors', 'Insights', 'About'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(255,255,255,0.97)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Wrap, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 68
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/infinium-logo.png",
    alt: "Infinium",
    style: {
      height: 34
    }
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: '#' + l.toLowerCase(),
    style: {
      padding: '8px 14px',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      font: 'var(--weight-medium) var(--text-sm)/1 var(--font-body)',
      color: 'var(--text-body)'
    }
  }, l)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12
    }
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: onContact
  }, "Start a conversation"))));
}
function Hero({
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "top",
    style: {
      background: 'var(--surface-dark)',
      color: 'var(--text-inverse)',
      padding: '104px 0 96px'
    }
  }, /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    onDark: true
  }, "Banking & financial services advisory"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--style-h1)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--white)'
    }
  }, "Clarity in complex financial systems."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--style-body-lg)',
      color: 'rgba(255,255,255,0.72)',
      maxWidth: 560
    }
  }, "Infinium helps banks and financial institutions deliver regulatory change, technology transformation and operational discipline \u2014 with partners who have done it before."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onContact
  }, "Start a conversation"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    style: {
      background: 'transparent',
      color: 'var(--white)',
      border: '1px solid var(--border-on-dark)'
    }
  }, "Our services"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 64,
      marginTop: 72,
      paddingTop: 40,
      borderTop: '1px solid var(--border-on-dark)',
      flexWrap: 'wrap'
    }
  }, [['€2.4B', 'Assets under advisory'], ['40+', 'Engagements delivered'], ['12', 'Markets served'], ['96%', 'Repeat clients']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      font: 'var(--weight-medium) 30px/1.1 var(--font-mono)',
      color: 'var(--white)'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-caption)',
      color: 'rgba(255,255,255,0.55)'
    }
  }, l))))));
}
function Services() {
  const items = [{
    icon: 'shield-check',
    eyebrow: 'Risk & compliance',
    title: 'Regulatory change',
    body: 'Basel IV, DORA and ESG readiness — from gap assessment to embedded controls.'
  }, {
    icon: 'landmark',
    eyebrow: 'Transformation',
    title: 'Core banking migration',
    body: 'Programme leadership from vendor selection through cut-over and stabilisation.'
  }, {
    icon: 'trending-up',
    eyebrow: 'Performance',
    title: 'Operational excellence',
    body: 'Cost discipline and process redesign that hold up under regulatory scrutiny.'
  }, {
    icon: 'scale',
    eyebrow: 'Governance',
    title: 'Model & data governance',
    body: 'Defensible frameworks for model risk, data lineage and reporting quality.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      padding: 'var(--section-pad) 0',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 48,
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "What we do"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--style-h2)',
      color: 'var(--text-heading)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, "Advisory built for regulated industries")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20
    }
  }, items.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.title,
    hoverable: true,
    eyebrow: s.eyebrow,
    title: s.title,
    footer: /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: 'var(--weight-medium) var(--text-sm)/1 var(--font-body)',
        color: 'var(--accent)',
        textDecoration: 'none'
      }
    }, "Learn more ", /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15
    }))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 24,
    color: "var(--blue-600)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-normal)'
    }
  }, s.body)))))));
}
function Sectors() {
  const sectors = [['Retail & commercial banking', 'Lending, deposits and payments modernisation under supervisory pressure.'], ['Payments & fintech', 'Licensing, scheme compliance and scale-up operating models.'], ['Asset & wealth management', 'Distribution, reporting and cost transparency across mandates.'], ['Insurance', 'Solvency, IFRS 17 delivery and claims transformation.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "sectors",
    style: {
      padding: 'var(--section-pad) 0',
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Wrap, {
    style: {
      display: 'grid',
      gridTemplateColumns: '360px 1fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Who we serve"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--style-h2)',
      color: 'var(--text-heading)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, "Sectors"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--style-body)',
      color: 'var(--text-muted)'
    }
  }, "Deep, current experience across the regulated financial landscape of the Benelux and beyond.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, sectors.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'grid',
      gridTemplateColumns: '32px 260px 1fr',
      gap: 24,
      alignItems: 'baseline',
      padding: '22px 0',
      borderTop: i === 0 ? 'none' : '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-sm)/1 var(--font-mono)',
      color: 'var(--text-faint)'
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("strong", {
    style: {
      font: 'var(--weight-semibold) var(--text-md)/1.3 var(--font-display)',
      color: 'var(--text-heading)'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--style-caption)',
      color: 'var(--text-muted)'
    }
  }, d))))));
}
Object.assign(window, {
  Icon,
  Wrap,
  Eyebrow,
  SiteNav,
  Hero,
  Services,
  Sectors
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
