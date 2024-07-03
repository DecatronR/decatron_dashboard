import { useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, ButtonBase, SvgIcon, Collapse } from '@mui/material';
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, subItems = [] } = props;
  const [openSubItems, setOpenSubItems] = useState(false);
  const hasSubItems = subItems.length > 0;

  const handleToggle = () => {
    setOpenSubItems((prevOpen) => !prevOpen);
  };

  const linkProps = path
    ? external
      ? {
        component: 'a',
        href: path,
        target: '_blank'
      }
      : {
        component: NextLink,
        href: path
      }
    : {};

  return (
    <>
    <li>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }
        }}
        onClick={hasSubItems ? handleToggle : undefined}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.main'
              })
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: 'neutral.400',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(active && {
              color: 'common.white'
            }),
            ...(disabled && {
              color: 'neutral.500'
            })
          }}
        >
          {title}
        </Box>
        {hasSubItems && (
            <SvgIcon fontSize="small" sx={{ ml: 1 }}>
              {openSubItems ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </SvgIcon>
          )}
      </ButtonBase>
    </li>
    {hasSubItems && (
  <Collapse in={openSubItems} timeout="auto" unmountOnExit>
    <Box sx={{ pl: 4 }}>
      {subItems.map((subItem) => (
        <SideNavItem
          key={subItem.title}
          title={subItem.title}
          path={subItem.path}
          icon={subItem.icon}
          active={subItem.path === path}
        />
      ))}
    </Box>
  </Collapse>
)}
</>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired
};
