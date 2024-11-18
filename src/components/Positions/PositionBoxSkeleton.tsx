import clsx from "clsx"
import styles from "./PositionBoxSkeleton.module.scss"

interface PositionBoxSkeletonProps {
  shorthand: string
  children?: React.ReactNode
  className?: string
  style?: object
  hidden?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  hovered?: boolean
  onHover?: (hovered: boolean) => void
}

const PositionBoxSkeleton = (props: PositionBoxSkeletonProps) => {
  return (
    <div
      className={clsx(
        styles.Box,
        props.hidden && styles.hidden,
        props.hovered && styles.hovered,
        props.className
      )}
      style={props.style}
      onClick={props.onClick}
      onMouseEnter={!props.onHover ? undefined : (() => props.onHover && props.onHover(true))}
      onMouseLeave={!props.onHover ? undefined : (() => props.onHover && props.onHover(false))}
    >
      <div className={styles.Shorthand}>{props.shorthand}</div>
      {props.children}
    </div>

  )
}

export default PositionBoxSkeleton