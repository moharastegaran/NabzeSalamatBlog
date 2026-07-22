import { ImgHTMLAttributes } from 'react';
import logo from '../../images/logo.png';

export default function ApplicationLogo({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={logo} alt="نبض سلامت" className={className} {...props} />;
}
