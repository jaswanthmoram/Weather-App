import { FaGithub } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function Footer(){
    return(
        <>
          <div className="lg:mx-7 mx-4 lg:px-5 md:px-5 px-2 lg:py-5 md:py-5 py-3 mt-14 flex lg:flex-row md:flex-row flex-col lg:gap-0 gap-4 items-center justify-between bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
             <p className="font-semibold lg:text-sm md:text-sm text-xs text-white text-center hover:text-gray-300 transition-colors duration-300">© 2025 Jaswanth Moram. All rights reserved.</p>
             <div className="flex gap-6 justify-center">
                <a href={'https://github.com/jaswanthmoram'} target="_blank" className="transform hover:scale-110 transition-transform duration-300">
                    <p className="text-2xl text-white hover:text-gray-300 rounded-full"><FaGithub/></p>
                </a>
                <a href={'https://www.linkedin.com/in/venkata-satya-jaswanth-moram-502a1a217/'} target="_blank" className="transform hover:scale-110 transition-transform duration-300">
                    <p className="text-2xl text-white hover:text-blue-500 rounded-full"><FaLinkedinIn/></p>
                </a>
                <a href={'mailto:jaswanthmoram@gmail.com'} className="transform hover:scale-110 transition-transform duration-300">
                    <p className="text-2xl text-white hover:text-red-500 rounded-full"><MdEmail/></p>
                </a>
             </div>
          </div>
        </>
    )
}