import clsx from "clsx";
import styles from "./PositionGridSkeleton.module.scss";
import { Positions } from "../../db-typings/electron/Models";
import DB, { ElectronAlert } from "../../DB";
import useReRender from "../../reusable/hooks/useReRender";
import { useRef } from "react";

interface PositionGridSkeletonProps {
  children: React.ReactNode;
  className?: string;
  selected?: Positions | null | undefined; // Allow selected to be null
}

const PositionGridSkeleton = ({ children, className, selected }: PositionGridSkeletonProps) => {
  const { ReRender, counter } = useReRender();
  const gridRef = useRef<HTMLDivElement | null>(null);

  const selectPosition = async (event: React.MouseEvent<HTMLDivElement>, selected: Positions | null | undefined) => {
    if (!selected) {
      return; // Early return if no position is selected
    }

    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      console.log(`Div Position: Top: ${rect.top}, Left: ${rect.left}`);

      let positionX = (event.clientX - rect.left); // Get the x-coordinate
      let positionY = (event.clientY - rect.top); // Get the y-coordinate
      positionX = positionX - positionX % 20 + 1;
      positionY = positionY - positionY % 20 + 1;

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
    }
  };

  return (
    <div ref={gridRef} className={clsx(styles.Container, className)} onClick={(event) => selectPosition(event, selected)}>
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
