import React, { Component, Fragment } from 'react';
import { bool, node, string } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import HelpIcon from 'mdi-react/HelpIcon';
import LightBulbOn from 'mdi-react/LightbulbOnIcon';
import BookOpenPageVariantIcon from 'mdi-react/BookOpenPageVariantIcon';
import LightBulbOnOutline from 'mdi-react/LightbulbOnOutlineIcon';
import PageTitle from '../PageTitle';
import Helmet from '../Helmet';
import UserMenu from './UserMenu';
import SidebarList from './SidebarList';
import { THEME, DOCS_PATH_PREFIX } from '../../utils/constants';
import { withThemeToggler } from '../../utils/ToggleTheme';
import Logo from '../../images/logo.png';
import ErrorPanel from '../ErrorPanel';
import DocsSidebarList from './DocsSidebarList';

@withRouter
@withStyles(
  theme => ({
    root: {
      flexGrow: 1,
      minHeight: '100vh',
      zIndex: 1,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      width: '100%',
    },
    appBar: {
      position: 'fixed',
      backgroundColor: theme.palette.secondary.dark,
      zIndex: theme.zIndex.drawer + 1,
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${theme.drawerWidth}px)`,
      },
    },
    docsAppBar: {
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${theme.docsDrawerWidth}px)`,
      },
    },
    docsContentWidth: {
      width: `calc(100% - ${theme.docsDrawerWidth}px)`,
    },
    appBarTitle: {
      fontFamily: 'Roboto300',
      flex: 1,
      color: THEME.PRIMARY_TEXT_DARK,
    },
    navIconHide: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    toolbar: {
      ...theme.mixins.toolbar,
      paddingLeft: theme.spacing.double,
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    drawerPaper: {
      color: theme.palette.secondary.contrastText,
      width: theme.drawerWidth,
      [theme.breakpoints.up('md')]: {
        position: 'fixed',
      },
      borderRight: 0,
      backgroundColor: theme.palette.primary.main,
    },
    docsDrawerPaper: {
      width: theme.docsDrawerWidth,
    },
    helpDrawerPaper: {
      width: '40vw',
      [theme.breakpoints.down('sm')]: {
        width: '90vw',
      },
      backgroundColor: theme.palette.primary.main,
      padding: theme.spacing.triple,
    },
    title: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      width: '100%',
    },
    contentPadding: {
      paddingTop: theme.spacing.triple,
      paddingLeft: theme.spacing.triple,
      paddingRight: theme.spacing.triple,
      paddingBottom: theme.spacing.triple * 4,
    },
    logoStyle: {
      marginTop: theme.spacing.unit,
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background,
      overflowY: 'auto',
      minHeight: 'calc(100vh - 56px)',
      marginTop: 56,
      [theme.breakpoints.up('sm')]: {
        minHeight: 'calc(100vh - 64px)',
        marginTop: 64,
      },
      [theme.breakpoints.up('md')]: {
        marginLeft: theme.drawerWidth,
        width: `calc(100% - ${theme.drawerWidth}px)`,
      },
    },
    docsContent: {
      [theme.breakpoints.up('md')]: {
        marginLeft: theme.docsDrawerWidth,
        width: `calc(100% - ${theme.docsDrawerWidth}px)`,
      },
    },
    appBarButton: {
      marginLeft: theme.spacing.unit,
    },
    appIcon: {
      fill: theme.palette.common.white,
    },
    helpCloseIcon: {
      position: 'absolute',
      top: theme.spacing.unit,
      right: theme.spacing.unit,
    },
  }),
  { withTheme: true }
)
@withThemeToggler
/**
 * Render the layout for application-based views.
 */
export default class Dashboard extends Component {
  static defaultProps = {
    title: '',
    disablePadding: false,
    search: null,
    helpView: null,
    docs: false,
  };

  static propTypes = {
    /**
     * The content to render within the main view body.
     */
    children: node.isRequired,
    /**
     * An optional title to display in the title bar and app bar.
     */
    title: string,
    /**
     * Disable padding of the main content. Useful for expanding content to the
     * full bounds of the content area.
     */
    disablePadding: bool,
    /**
     * Render elements in the app bar for searching purposes.
     */
    search: node,
    /**
     * Each page could contain important information for the new user
     * of a particular view, but often doesn't warrant needing to
     * be shown every time.
     */
    helpView: node,
    /**
     * If true, the documentation table of content will be displayed.
     */
    docs: bool,
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  state = {
    mobileOpen: false,
    showHelpView: false,
    error: null,
    showLogo: false,
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleHelpViewToggle = () => {
    this.setState({ showHelpView: !this.state.showHelpView });
  };

  handleTitleToggle = () => {
    this.setState({ showLogo: !this.state.showLogo });
  };

  render() {
    const {
      classes,
      className,
      children,
      disablePadding,
      theme,
      title,
      search,
      helpView,
      onToggleTheme,
      docs,
      history,
      staticContext: _,
      ...props
    } = this.props;
    const { error, mobileOpen, showHelpView, showLogo } = this.state;
    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="close drawer"
            onClick={this.handleDrawerToggle}
            className={classes.navIconHide}>
            <MenuIcon />
          </IconButton>
          <Typography
            onMouseEnter={this.handleTitleToggle}
            onMouseLeave={this.handleTitleToggle}
            component={Link}
            to="/"
            variant="h6"
            noWrap
            className={classes.title}>
            {showLogo ? (
              <img
                className={classes.logoStyle}
                height={30}
                alt="logo"
                src={Logo}
              />
            ) : (
              process.env.APPLICATION_NAME
            )}
          </Typography>
        </div>
        <Divider />
        <UserMenu />
        <Divider />
        {docs ? <DocsSidebarList /> : <SidebarList />}
      </div>
    );
    const isDocs = history.location.pathname.startsWith(DOCS_PATH_PREFIX);

    return (
      <div className={classes.root}>
        <Helmet />
        <PageTitle>{title}</PageTitle>
        <AppBar
          className={classNames(classes.appBar, {
            [classes.docsAppBar]: isDocs,
          })}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}>
              <MenuIcon className={classes.appIcon} />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.appBarTitle}>
              {title}
            </Typography>
            {search}
            <Tooltip placement="bottom" title="Toggle light/dark theme">
              <IconButton
                className={classes.appBarButton}
                onClick={onToggleTheme}>
                {theme.palette.type === 'dark' ? (
                  <LightBulbOn className={classes.appIcon} />
                ) : (
                  <LightBulbOnOutline className={classes.appIcon} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip placement="bottom" title="Documentation">
              <IconButton
                className={classes.appBarButton}
                component={Link}
                to={DOCS_PATH_PREFIX}>
                <BookOpenPageVariantIcon className={classes.appIcon} />
              </IconButton>
            </Tooltip>
            {helpView && (
              <Tooltip placement="bottom" title="Page Information">
                <IconButton
                  onClick={this.handleHelpViewToggle}
                  className={classes.appBarButton}>
                  <HelpIcon className={classes.appIcon} />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classNames(classes.drawerPaper, {
                [classes.docsDrawerPaper]: isDocs,
              }),
            }}
            ModalProps={{
              keepMounted: true,
            }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            PaperProps={{
              elevation: 2,
            }}
            classes={{
              paper: classNames(classes.drawerPaper, {
                [classes.docsDrawerPaper]: isDocs,
              }),
            }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'left' : 'right'}
          open={showHelpView}
          onClose={this.handleHelpViewToggle}
          classes={{
            paper: classes.helpDrawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}>
          <Fragment>
            <IconButton
              onClick={this.handleHelpViewToggle}
              className={classes.helpCloseIcon}>
              <CloseIcon />
            </IconButton>
            {helpView}
          </Fragment>
        </Drawer>
        <main
          className={classNames(
            classes.content,
            {
              [classes.contentPadding]: !disablePadding,
              [classes.docsContent]: isDocs,
            },
            className
          )}
          {...props}>
          {error ? <ErrorPanel error={error} /> : children}
        </main>
      </div>
    );
  }
}
