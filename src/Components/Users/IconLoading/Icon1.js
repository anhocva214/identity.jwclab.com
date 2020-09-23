
const IconLoading1 = () => {
    return (
        <>
            <div className="loader loader--style3 d-flex justify-content-center" title={2}>
                <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style={{ enableBackground: 'new 0 0 50 50' }} xmlSpace="preserve">
                    <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>

            <style jsx>{`
                .loader{
                    margin: 0 0 2em;
                    height: 100px;
                    width: 20%;
                    text-align: center;
                    padding: 1em;
                    margin: 0 auto 1em;
                    display: inline-block;
                    vertical-align: top;
                  }
                  
                  /*
                    Set the color of the icon
                  */
                  svg path,
                  svg rect{
                    fill: #007bff;
                  }
            
            `}</style>
        </>
    )
}

export default IconLoading1;