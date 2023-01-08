import "./dashboard.css";

const Dashboard = (): JSX.Element => {
  return (
    <div>
      <div className="dash-nav">
        <ul className="dash-list">
          <li className="dash-list-item active-item">Statistics</li>
          <li className="dash-list-item">Add Product</li>
          <li className="dash-list-item">Users</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
