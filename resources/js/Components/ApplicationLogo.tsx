import { ImgHTMLAttributes } from 'react';
import gsunLogo from '../../images/gsun-texten-logo.png';

export default function ApplicationLogo({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={gsunLogo} alt="Gsun" className={className} {...props} />;
}
