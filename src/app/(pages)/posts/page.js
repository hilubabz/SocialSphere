export default function Page(){
    return(
        <>
            <div className="flex justify-around">
                <div>
                    <img src="/Logo.png"/>
                </div>
                <div className="flex gap-5">
                    <div>Home</div>
                    <div>Discover</div>
                    <div>Add Friend</div>
                </div>
                <div>
                    <div>Profile</div>
                </div>
            </div>
            <div className="h-[200vh]"></div>
        </>
    )
}