import { useRef, useEffect, forwardRef, type ReactNode, type HTMLAttributes, type MouseEventHandler, type FC } from 'react';
import { attachRipple } from '../../src/library.ts';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'outlined' | 'elevated' | 'filled' | 'glass';
  interactive?: boolean;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  avatar?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

interface CardComponent
  extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> {
  Header: FC<CardHeaderProps>;
  Body: FC<CardSectionProps>;
  Actions: FC<CardSectionProps>;
  Divider: FC<HTMLAttributes<HTMLDivElement>>;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'outlined', interactive = false, className = '', children, onClick, ...props },
  externalRef
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = (externalRef as React.RefObject<HTMLDivElement>) || internalRef;

  useEffect(() => {
    if (interactive && ref.current) attachRipple(ref.current);
  }, [interactive, ref]);

  const classes = [
    'vx-card',
    `vx-card-${variant}`,
    interactive && 'vx-card-interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}) as CardComponent;

Card.Header = function CardHeader({ avatar, title, subtitle, action, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`vx-card-header ${className}`} {...props}>
      {avatar && <div className="vx-card-avatar">{avatar}</div>}
      <div style={{ flex: 1 }}>
        {title && <div className="vx-card-title">{title}</div>}
        {subtitle && <div className="vx-card-subtitle">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
};

Card.Body = function CardBody({ className = '', children, ...props }: CardSectionProps) {
  return (
    <div className={`vx-card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Actions = function CardActions({ className = '', children, ...props }: CardSectionProps) {
  return (
    <div className={`vx-card-actions ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Divider = function CardDivider({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`vx-card-divider ${className}`} {...props} />;
};