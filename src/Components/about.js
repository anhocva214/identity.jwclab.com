
const About = () => {
    return (
        <>
            <ul className="nav nav-pills mb-3 nav-about d-flex" id="pills-tab" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Profile</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Contact</a>
                </li>
            </ul>
            <div className="tab-content about-content d-block" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui voluptatem quae soluta. Qui facere temporibus, nulla harum natus eos cupiditate omnis provident ex blanditiis exercitationem tempore. Hic dolorum blanditiis distinctio.
        </div>
                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui voluptatem quae soluta. Qui facere temporibus, nulla harum natus eos cupiditate omnis provident ex blanditiis exercitationem tempore. Hic dolorum blanditiis distinctio.
        </div>
                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui voluptatem quae soluta. Qui facere temporibus, nulla harum natus eos cupiditate omnis provident ex blanditiis exercitationem tempore. Hic dolorum blanditiis distinctio.
        </div>
            </div>
        </>
    )
}

export default About;