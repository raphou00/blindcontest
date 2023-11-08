const secretKey = "6LdVkgUpAAAAAFeqH4TjOqoEHHA1_4FQNNJHT-9y";

const verifyCaptcha = async (token: string) => {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
        method: "post"
    });

    return await res.json();
}

export default verifyCaptcha;