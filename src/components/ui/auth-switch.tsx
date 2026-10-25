"use client";

import { useState, type FormEvent } from "react";
import { Mail, Lock, User } from "lucide-react";
import logoSrc from "../../assets/logo.png";

export interface AuthSwitchProps {
  onLogin?: () => void;
  onSignUp?: () => void;
}

export default function AuthSwitch({ onLogin, onSignUp }: AuthSwitchProps = {}) {
  const [isSignUp, setIsSignUp] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSignUp) {
      if (onSignUp) {
        onSignUp();
      } else if (onLogin) {
        onLogin();
      }
    } else {
      if (onLogin) {
        onLogin();
      }
    }
  };

  return (
    <div className="auth-switch">
      <style>{`
        .auth-switch,
        .auth-switch * {
          box-sizing: border-box;
        }

        .auth-switch {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #070B14 0%, #0F172A 50%, #1E1B4B 100%);
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .auth-switch::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.15) 0%, transparent 40%);
          pointer-events: none;
        }

        .container {
          position: relative;
          width: 100%;
          max-width: 980px;
          height: 640px;
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(249, 115, 22, 0.15);
          overflow: hidden;
          z-index: 1;
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 4.5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        form.sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        form.sign-in-form {
          z-index: 2;
        }

        .form-brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding: 6px 14px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          width: 100%;
          max-width: 380px;
        }

        .brand-logo-frame {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          flex-shrink: 0;
        }

        .brand-logo-frame img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .brand-ping-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #ffffff;
          box-shadow: 0 0 4px rgba(16, 185, 129, 0.6);
        }

        .brand-text-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .brand-title-text {
          font-size: 1.15rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.01em;
          line-height: 1.1;
        }

        .brand-badge-pill {
          padding: 1px 7px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
          color: #ffffff;
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .brand-subtext {
          font-size: 0.68rem;
          font-weight: 600;
          color: #64748b;
          margin-top: 1px;
        }

        .title {
          font-size: 1.75rem;
          color: #0f172a;
          margin-bottom: 2px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 12px;
          text-align: center;
        }

        .input-field {
          max-width: 380px;
          width: 100%;
          background-color: #f8fafc;
          margin: 6px 0;
          height: 48px;
          border-radius: 50px;
          display: grid;
          grid-template-columns: 15% 85%;
          padding: 0 0.5rem;
          position: relative;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .input-field:focus-within {
          background-color: #ffffff;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
        }

        .input-field i {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: 0.3s;
          font-size: 1.1rem;
        }

        .input-field:focus-within i {
          color: #ea580c;
        }

        .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 0.95rem;
          color: #0f172a;
          width: 100%;
        }

        .input-field input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .btn {
          width: 160px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: none;
          outline: none;
          height: 44px;
          border-radius: 48px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin: 10px 0 8px 0;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
        }

        .btn:hover {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(234, 88, 12, 0.45);
        }

        .btn:active {
          transform: translateY(0);
        }

        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: all;
          padding: 2.5rem 22% 2.5rem 8%;
        }

        .right-panel {
          pointer-events: none;
          padding: 2.5rem 8% 2.5rem 22%;
        }

        .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          max-width: 280px;
          margin: 0 auto;
        }

        .panel h3 {
          font-weight: 800;
          line-height: 1.2;
          font-size: 1.85rem;
          margin: 4px 0 10px 0;
          color: #ffffff;
          letter-spacing: -0.02em;
          text-align: center;
        }

        .panel p {
          font-size: 0.88rem;
          padding: 0 0 1.5rem 0;
          color: rgba(255, 255, 255, 0.92);
          line-height: 1.55;
          text-align: center;
          max-width: 260px;
          margin: 0 auto;
        }

        .btn.transparent {
          margin: 0;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid #fff;
          width: 140px;
          height: 44px;
          font-weight: 700;
          font-size: 0.82rem;
          border-radius: 44px;
          backdrop-filter: blur(6px);
        }

        .btn.transparent:hover {
          background: #ffffff;
          color: #ea580c;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .panel-logo-card {
          width: 90px;
          height: 90px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), 0 0 25px rgba(249, 115, 22, 0.35);
          border: 2px solid rgba(255, 255, 255, 0.9);
          position: relative;
          transition: transform 0.3s ease;
        }

        .panel-logo-card:hover {
          transform: scale(1.06);
        }

        .panel-logo-card img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
        }

        .panel-online-badge {
          position: absolute;
          bottom: -3px;
          right: -3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .right-panel .content {
          transform: translateX(800px);
        }

        .container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .container.sign-up-mode form.sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .container.sign-up-mode form.sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        .container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(-45deg, #f97316 0%, #ea580c 35%, #be123c 70%, #1e1b4b 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
          box-shadow: 0 0 60px rgba(234, 88, 12, 0.35);
        }

        .social-text {
          padding: 0.6rem 0;
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .social-media {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .social-icon {
          height: 44px;
          width: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          color: #6366f1;
          font-size: 1.1rem;
          transition: 0.3s;
          cursor: pointer;
          background: #f8fafc;
        }

        .social-icon:hover {
          border-color: #6366f1;
          background: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 6px 14px rgba(99, 102, 241, 0.15);
        }

        @media (max-width: 870px) {
          .container {
            min-height: 800px;
            height: 100vh;
          }
          .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }
          .signin-signup,
          .container.sign-up-mode .signin-signup {
            left: 50%;
          }
          .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }
          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }
          .right-panel {
            grid-row: 3 / 4;
          }
          .left-panel {
            grid-row: 1 / 2;
          }
          .panel .content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }
          .panel h3 {
            font-size: 1.2rem;
          }
          .panel p {
            font-size: 0.75rem;
            padding: 0.5rem 0;
          }
          .btn.transparent {
            width: 120px;
            height: 38px;
            font-size: 0.75rem;
          }
          .container:before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }
          .container.sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }
          .container.sign-up-mode .left-panel .content {
            transform: translateY(-300px);
          }
          .container.sign-up-mode .right-panel .content {
            transform: translateY(0px);
          }
          .right-panel .content {
            transform: translateY(300px);
          }
          .container.sign-up-mode .signin-signup {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          form {
            padding: 0 1.5rem;
          }
          .panel .content {
            padding: 0.5rem 1rem;
          }
        }
      `}</style>

      <div className={isSignUp ? "container sign-up-mode" : "container"}>
        <div className="forms-container">
          <div className="signin-signup">
            <form className="sign-in-form" onSubmit={onSubmit}>
              <div className="form-brand-header">
                <div className="brand-logo-frame">
                  <img src={logoSrc} alt="FireBot Logo" />
                  <span className="brand-ping-dot" />
                </div>
                <div className="brand-text-wrap">
                  <div className="brand-title-row">
                    <span className="brand-title-text">FireBot</span>
                    <span className="brand-badge-pill">PRO X-1</span>
                  </div>
                  <span className="brand-subtext">Autonomous Sentinel Console</span>
                </div>
              </div>

              <h2 className="title">Sign in</h2>
              <p className="subtitle">Enter your credentials to access the console</p>
              <div className="input-field">
                <i>
                  <Mail size={19} />
                </i>
                <input type="email" placeholder="Email" defaultValue="commander@firebot.local" required />
              </div>
              <div className="input-field">
                <i>
                  <Lock size={19} />
                </i>
                <input type="password" placeholder="Password" defaultValue="••••••••" required />
              </div>
              <input type="submit" value="Sign In" className="btn solid" />
              <p className="social-text">Or sign in with secure SSO</p>
              <div className="social-media">
                <SocialIcons />
              </div>
            </form>

            <form className="sign-up-form" onSubmit={onSubmit}>
              <div className="form-brand-header">
                <div className="brand-logo-frame">
                  <img src={logoSrc} alt="FireBot Logo" />
                  <span className="brand-ping-dot" />
                </div>
                <div className="brand-text-wrap">
                  <div className="brand-title-row">
                    <span className="brand-title-text">FireBot</span>
                    <span className="brand-badge-pill">PRO X-1</span>
                  </div>
                  <span className="brand-subtext">Autonomous Sentinel Console</span>
                </div>
              </div>

              <h2 className="title">Sign up</h2>
              <p className="subtitle">Register new operator identity</p>
              <div className="input-field">
                <i>
                  <User size={19} />
                </i>
                <input type="text" placeholder="Username" required />
              </div>
              <div className="input-field">
                <i>
                  <Mail size={19} />
                </i>
                <input type="email" placeholder="Email" required />
              </div>
              <div className="input-field">
                <i>
                  <Lock size={19} />
                </i>
                <input type="password" placeholder="Password" required />
              </div>
              <input type="submit" value="Sign up" className="btn" />
              <p className="social-text">Or register with enterprise identity</p>
              <div className="social-media">
                <SocialIcons />
              </div>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <div className="panel-logo-card">
                <img
                  src={logoSrc}
                  alt="FireBot Sentinel System"
                />
                <span className="panel-online-badge" />
              </div>
              <h3>New here?</h3>
              <p>
                Join the FireBot Sentinel Network and unlock autonomous fire response
                monitoring in real time.
              </p>
              <button
                type="button"
                className="btn transparent"
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="content">
              <div className="panel-logo-card">
                <img
                  src={logoSrc}
                  alt="FireBot Sentinel System"
                />
                <span className="panel-online-badge" />
              </div>
              <h3>One of us?</h3>
              <p>Welcome back! Sign in to resume robot telemetry, live thermal tracking, and nozzle control.</p>
              <button
                type="button"
                className="btn transparent"
                onClick={() => setIsSignUp(false)}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcons() {
  return (
    <>
      <a href="#" className="social-icon" title="Google SSO">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </a>
      <a href="#" className="social-icon" title="Meta SSO">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="#1877F2"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>
      <a href="#" className="social-icon" title="X SSO">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="#1DA1F2"
        >
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </a>
      <a href="#" className="social-icon" title="LinkedIn SSO">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="#0A66C2"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </>
  );
}
