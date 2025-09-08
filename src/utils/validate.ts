export class UserValidate {
    private email: string;
    private username: string;
    private password: string;
    private _errors: string[] = [];

    constructor(email: string, username: string, password: string) {
        this.email = email;
        this.username = username;
        this.password = password;
    }
    
    public validate(): boolean { 
        this._errors = [];

        const emailError = this.validateEmail();
        if (emailError) this._errors.push(emailError);

        const usernameError = this.validateUsername();
        if (usernameError) this._errors.push(usernameError);

        const passwordError = this.validatePassword();
        if (passwordError) this._errors.push(passwordError);

        return this._errors.length === 0;
    }

    public get errors(): string[] {
        return this._errors;
    }
    
    private validateEmail(): string | null {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email) return "Email is required!";
        if (!regex.test(this.email)) return "Invalid email format!";
        return null;
    }

    private validateUsername(): string | null {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!this.username) return "Username is required!";
        if (!regex.test(this.username)) {
            return "Username must be 3–20 characters long and contain only letters, numbers, or underscores!";
        }
        return null;
    }

    private validatePassword(): string | null {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!this.password) return "Password is required!";
        if (!regex.test(this.password)) {
            return "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
        }
        return null;
    }
}
