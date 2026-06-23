import {
  FOREST_TREES,
  SMALL_TREE_MAX_VH,
  TREE_SRC,
  type TreeSpec,
} from "@/lib/whimsy/forest-trees";

function swayClass(heightVh: number) {
  return heightVh <= SMALL_TREE_MAX_VH ? "forest-tree-sway-sm" : "forest-tree-sway";
}

function TreeSprite({ tree }: { tree: TreeSpec }) {
  return (
    <div
      className="absolute bottom-0 leading-[0]"
      style={{
        left: `${tree.left}%`,
        height: `${tree.heightVh}vh`,
        zIndex: tree.zIndex ?? 3,
        opacity: tree.opacity ?? 1,
      }}
    >
      <div className="h-full -translate-x-1/2">
        <div
          className={`flex h-full items-end ${swayClass(tree.heightVh)}`}
          style={{
            animationDelay: tree.swayDelay !== undefined ? `${tree.swayDelay}s` : undefined,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={TREE_SRC}
            alt=""
            draggable={false}
            className="forest-tree-img block h-full w-auto max-w-none select-none"
            style={tree.flip ? { transform: "scaleX(-1)" } : undefined}
          />
        </div>
      </div>
    </div>
  );
}

export function ForestEdge() {
  return (
    <div
      className="forest-edge pointer-events-none fixed inset-x-0 bottom-0 z-[1] m-0 overflow-visible p-0"
      aria-hidden="true"
    >
      <div className="forest-edge-fade pointer-events-none absolute inset-x-0 bottom-[58vh] h-32" />
      <div className="relative w-full">
        {FOREST_TREES.map((tree) => (
          <TreeSprite key={tree.id} tree={tree} />
        ))}
      </div>
    </div>
  );
}
