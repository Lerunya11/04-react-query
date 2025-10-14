import css from './ErrorMessage.module.css';
export interface ErrorMessageProps { children?: React.ReactNode }
export default function ErrorMessage({ children }: ErrorMessageProps) {
  return <div className={css.box}>{children ?? 'Something went wrong. Please try again later.'}</div>;
}
