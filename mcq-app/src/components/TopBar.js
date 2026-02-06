import { UserButton } from "@clerk/clerk-react";

function TopBar() {
  return (
    <div className="top-bar">
      <h2>MCQ Generator</h2>
      <UserButton />
    </div>
  );
}

export default TopBar;
