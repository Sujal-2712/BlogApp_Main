import { useState, useRef, useEffect } from "react";

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {
    const activeTabLineRef = useRef();
    const activeTabRef = useRef();
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    const changePageState = (btn, i) => {
        const { offsetWidth, offsetLeft } = btn;
        if (activeTabLineRef.current) {
            activeTabLineRef.current.style.width = offsetWidth + "px";
            activeTabLineRef.current.style.left = offsetLeft + "px";
        }
        setInPageNavIndex(i);
    };

    useEffect(() => {
        if (activeTabRef.current) {
            changePageState(activeTabRef.current, defaultActiveIndex);
        }
    }, [defaultActiveIndex]);

    return (
        <>
            {/* Navigation Bar */}
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {routes.map((route, i) => (
                    <button
                        key={i}
                        ref={i === defaultActiveIndex ? activeTabRef : null}
                        onClick={(e) => {changePageState(e.target, i)}}
                        className={
                            "p-4 px-5 capitalize cursor-pointer " +
                            (inPageNavIndex === i ? "text-black" : "text-dark-grey ") +
                            (defaultHidden.includes(route) ? "md:hidden" : "")
                        }
                    >
                        {route}
                    </button>
                ))}
                <hr ref={activeTabLineRef} className="absolute bottom-0 h-1 bg-black duration-300" />
            </div>

            {/* Render the Active Page Content */}
            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    );
};

export default InPageNavigation;
