import { GithubSvg } from './githubSvg';
import { LanguagePicker } from './languagePicker';
import { Nav } from './nav';

const Header = () => {
  return (
    <header className="grid grid-cols-[3rem,1fr,3rem] h-12 border-b border-primary">
      <LanguagePicker />
      <Nav />
      <a href='https://github.com/yet3/J.A.T.git' className='border-l border-primary grid place-items-center' target='_blank' rel='noopener noreferrer'>
        <GithubSvg width={26} />
      </a>
    </header>
  );
};

export { Header };
