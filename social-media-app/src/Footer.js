const Footer = () => {
  const today = new Date();
  return (
    <footer className="Footer">
      <p>Copyright &copy; {today.getFullYear()}</p>
      <p>Version {process.env.REACT_APP_VERSION}</p>
    </footer>
  );
};

export default Footer;
