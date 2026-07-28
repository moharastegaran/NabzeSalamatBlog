import { ImgHTMLAttributes } from 'react';
import logoWithText from '../../images/logo.png';
import logoIcon from '../../images/android-chrome-512x512.png';

type ApplicationLogoProps = ImgHTMLAttributes<HTMLImageElement> & {
    withText?: boolean;
};

export default function ApplicationLogo({
    className,
    withText = true,
    ...props
}: ApplicationLogoProps) {
    return <img src={withText ? logoWithText : logoIcon} alt="نبض سلامت" className={className} {...props} />;
}
