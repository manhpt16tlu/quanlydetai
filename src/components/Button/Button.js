import classNames from 'classnames';
import style from './Button.module.scss';
function Button({ children, active, danger }) {
  const classes = classNames({
    [style.active]: active,
    [style.danger]: danger,
  });
  return <button className={classes}>{children}</button>;
}

export default Button;
