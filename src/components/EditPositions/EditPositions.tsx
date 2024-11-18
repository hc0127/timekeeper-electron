import clsx from "clsx"
import { Fragment, useState } from "react"
import DB from "../../DB"
import { Positions } from "../../db-typings/electron/Models"
import useAsyncRefresh from "../../reusable/hooks/useAsyncRefresh"
import styles from "./EditPositions.module.scss"
import { IoMdClose } from "react-icons/io"
import PositionsDrawer from "./PositionsDrawer"
import PositionBoxSkeleton from "../Positions/PositionBoxSkeleton"
import useReRender from "../../reusable/hooks/useReRender"
import PositionGridSkeleton from "../Positions/PositionGridSkeleton"

const EditPositions = () => {
  const { ReRender, counter } = useReRender()

  const { value: positions_value } = useAsyncRefresh(() => DB.Positions.GetAll(), [counter])
  const [selected, setSelected] = useState<Positions | null>(null)

  const positionMap = positions_value?.result
    .filter(position => position?.positionX && position?.positionY) // Filter out positions without positionX or positionY
    .map((position, i) => {
      return position; // Now this will only return valid positions
    });

  console.log(positionMap);

  return (
    <Fragment>
      <PositionsDrawer positions={positions_value?.result} setSelected={setSelected} selected={selected} />
      <PositionGridSkeleton className={styles.positions} selected={selected}>
        {positionMap?.map((position, i) => {
          return (
            <PositionBoxSkeleton
              key={i}
              style={{ top: `${position?.positionY}px`, left: `${position?.positionX}px` }}
              onClick={selected !== null ? async (event: React.MouseEvent<HTMLDivElement>) => {
                  event.stopPropagation();
                  setSelected(null);
                  await ReRender();
              } : undefined}
              shorthand={position?.shorthand ?? ""}
            >
              {typeof position !== "undefined" && (
                <div
                  className={styles.CloseButton}
                  onClick={async () => {
                    await DB.Positions.UpdateIndex(position.id, null, null)
                    ReRender()
                  }}
                ><IoMdClose /></div>
              )}
            </PositionBoxSkeleton>
          )
        })}
      </PositionGridSkeleton>
    </Fragment>
  )
}

export default EditPositions