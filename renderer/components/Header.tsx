import { Switch, Typography, Layout } from "antd";

export interface HeaderProps {
  serverOn?: boolean;
  onServerToggle?: VoidFunction;
  serverOnDisabled?: boolean;
}

const Header = ({
  serverOn,
  onServerToggle,
  serverOnDisabled,
}: HeaderProps) => {
  return (
    <Layout.Header style={{ display: "flex", alignItems: "center" }}>
      <Typography.Text style={{ color: "white", marginRight: 12 }}>
        Server Status:
      </Typography.Text>
      <Switch
        checkedChildren="ON"
        unCheckedChildren="OFF"
        disabled={serverOnDisabled}
        checked={serverOn}
        onChange={onServerToggle}
      />
    </Layout.Header>
  );
};

export default Header;
