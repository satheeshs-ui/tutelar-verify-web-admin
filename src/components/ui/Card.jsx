function Card({ className = "", ...props }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm p-6 md:p-8 mt-6 ${className}`} {...props} />
    );
}

function CardHeader({ className = "", ...props }) {
    return <div className={`grid items-start gap-2 px-6 ${className}`} {...props} />;
}

function CardTitle({ className = "", ...props }) {
    return <div className={`font-semibold leading-none ${className}`} {...props} />;
}

function CardDescription({ className = "", ...props }) {
    return <div className={`text-sm text-gray-500 ${className}`} {...props} />;
}

function CardAction({ className = "", ...props }) {
    return (
        <div
            data-slot="card-action"
            className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
            {...props}
        />
    );
}

function CardContent({ className = "", ...props }) {
    return <div className={`px-6 ${className}`} {...props} />;
}

function CardFooter({ className = "", ...props }) {
    return <div className={`flex items-center px-6 pt-6 border-t ${className}`} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
