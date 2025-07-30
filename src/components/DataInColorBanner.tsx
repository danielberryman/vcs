const DataInColorBanner = () => {
    return (
        <div className="fixed top-0 left-0 right-0 bg-gray-100 border-b border-gray-200 px-4 py-2 rounded text-xs">
            <div className="flex justify-between gap-2 pb-1">
                <p>Where's Your Data?</p>
                <p>Powered By <i><a href="#">The Webees</a></i></p>
            </div>
            <div className="flex gap-2">
                <div className="flex flex-col justify-between w-full break-words">
                    <p><strong>By You</strong></p>
                    <span className="block bg-green-600 rounded w-full h-1"></span>
                </div>
                <div className="flex flex-col justify-between w-full break-words">
                    <p><strong>Not Saved</strong></p>
                    <span className="block bg-yellow-300 rounded w-full h-1"></span>
                </div>
                <div className="flex flex-col justify-between w-full break-words">
                    <p><strong>Browser</strong></p>
                    <span className="block bg-blue-600 rounded w-full h-1"></span>
                </div>
                <div className="flex flex-col justify-between w-full break-words">
                    <p><strong>Companies</strong></p>
                    <span className="block bg-red-600 rounded w-full h-1"></span>
                </div>
            </div>
        </div>
    );
};

export default DataInColorBanner;
