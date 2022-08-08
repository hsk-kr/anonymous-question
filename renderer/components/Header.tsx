import { Switch, Typography, Layout } from "antd";

export interface HeaderProps {
  serverOn?: boolean;
  onServerToggle?: VoidFunction;
  serverOnDisabled?: boolean;
  port: string;
}

const Header = ({
  serverOn,
  onServerToggle,
  serverOnDisabled,
  port,
}: HeaderProps) => {
  return (
    <Layout.Header style={{ display: "flex", alignItems: "center" }}>
      <Typography.Text style={{ color: "white", marginRight: 12 }}>
        (:{port}) Server Status:
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
