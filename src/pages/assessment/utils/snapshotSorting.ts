interface ReduceSnapshot {
  createdAt?: string;
}

export function sortSnapshotsByTimestamp<T extends ReduceSnapshot>(
  snapshots: T[],
): T[] {
  return [...snapshots].sort((a, b) => {
    const timestampA = a.createdAt;
    const timestampB = b.createdAt;

    if (!timestampA && !timestampB) return 0;
    if (!timestampA) return 1;
    if (!timestampB) return -1;

    return new Date(timestampB).getTime() - new Date(timestampA).getTime();
  });
}
