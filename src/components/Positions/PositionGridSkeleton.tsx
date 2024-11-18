import clsx from "clsx";
import styles from "./PositionGridSkeleton.module.scss";
import { Positions } from "../../db-typings/electron/Models";
import DB, { ElectronAlert } from "../../DB";
import useReRender from "../../reusable/hooks/useReRender";

interface PositionGridSkeletonProps {
  children: React.ReactNode;
  className?: string;
  selected?: Positions | null | undefined; // Allow selected to be null
}

const PositionGridSkeleton = ({ children, className, selected }: PositionGridSkeletonProps) => {
  const { ReRender, counter } = useReRender();

  const selectPosition = async (event: React.MouseEvent<HTMLDivElement>, selected: Positions | null | undefined) => {
    if (!selected) {
      return; // Early return if no position is selected
    }

    const positionX = event.clientX; // Get the x-coordinate
    const positionY = event.clientY; // Get the y-coordinate

    try {
      await DB.Positions.Update({ ...selected, positionX, positionY });
    } catch (error) {
      if (
        (error as Error)
          .toString()
          .includes("UNIQUE constraint failed: positions.shorthand")
      ) {
        return setTimeout(() => ElectronAlert("Shorthand must be unique."));
      }
      throw error;
    }
    ReRender();
  };

  return (
    <div className={clsx(styles.Container, className)} onClick={(event) => selectPosition(event, selected)}>
      {
        selected &&
        <div className={clsx(styles.Grid)}>
        </div>
      }
      {children}
    </div>
  );
};

export default PositionGridSkeleton;
