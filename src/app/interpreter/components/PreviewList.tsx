type PreviewListProps = {
    items: string[];
    empty: string;
};

export default function PreviewList({ items, empty }: PreviewListProps) {
    if (!items.length) {
        return <p className="text-sm text-stone-500">{empty}</p>;
    }

    return (
        <ul className="space-y-2 text-sm text-stone-700">
            {items.map((item, index) => (
                <li
                    key={`${item}-${index}`}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2"
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}
