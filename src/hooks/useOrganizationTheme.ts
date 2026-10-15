import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';

export interface DynamicOrgTheme {
  organizationId: string;
  organizationName: string;
  theme: 'light' | 'dark';
  isDark: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  chartPalette: string[];
  gridStroke: string;
  tooltipStyle: {
    backgroundColor: string;
    borderColor: string;
    color: string;
    borderRadius: string;
    boxShadow: string;
  };
  cardBg: string;
  borderStroke: string;
  textPrimary: string;
  textSecondary: string;
}

/**
 * useOrganizationTheme
 * 
 * Provides dynamic, organization-tailored theme tokens, chart color palettes,
 * and light/dark mode telemetry parameters for ORBIS components.
 */
export const useOrganizationTheme = (): DynamicOrgTheme => {
  const { organization, theme } = useAuthStore();
  const orgId = (organization || 'hospital').toLowerCase();
  const currentOrg = ORGANIZATIONS[orgId] || ORGANIZATIONS.hospital;
  const isDark = theme !== 'light';

  // Dynamic Chart Palettes tailored by Organization & Mode
  const getChartPalette = (): string[] => {
    switch (orgId) {
      case 'hospital':
        return isDark 
          ? ['#00E0FF', '#0B6EFD', '#10B981', '#38BDF8']
          : ['#0284C7', '#0D9488', '#10B981', '#0EA5E9'];
      case 'bank':
        return isDark 
          ? ['#10B981', '#0284C7', '#F59E0B', '#34D399']
          : ['#047857', '#0369A1', '#D97706', '#059669'];
      case 'university':
        return isDark 
          ? ['#A78BFA', '#6366F1', '#C084FC', '#38BDF8']
          : ['#6D28D9', '#4F46E5', '#8B5CF6', '#2563EB'];
      case 'government':
        return isDark 
          ? ['#38BDF8', '#2563EB', '#EAB308', '#94A3B8']
          : ['#1D4ED8', '#334155', '#B45309', '#0284C7'];
      case 'manufacturing':
        return isDark 
          ? ['#EA580C', '#0284C7', '#F59E0B', '#64748B']
          : ['#C2410C', '#0369A1', '#D97706', '#475569'];
      case 'retail':
        return isDark 
          ? ['#F472B6', '#DB2777', '#7C3AED', '#38BDF8']
          : ['#BE185D', '#6D28D9', '#DB2777', '#2563EB'];
      case 'it':
      case 'technology':
      case 'startup':
        return isDark 
          ? ['#2563EB', '#7C3AED', '#06B6D4', '#60A5FA']
          : ['#1D4ED8', '#6D28D9', '#0891B2', '#2563EB'];
      case 'insurance':
        return isDark 
          ? ['#0284C7', '#0D9488', '#38BDF8', '#0EA5E9']
          : ['#0369A1', '#0F766E', '#0284C7', '#38BDF8'];
      case 'energy':
        return isDark 
          ? ['#22C55E', '#15803D', '#FACC15', '#4ADE80']
          : ['#16A34A', '#166534', '#CA8A04', '#15803D'];
      case 'construction':
        return isDark 
          ? ['#F59E0B', '#D97706', '#FCD34D', '#64748B']
          : ['#D97706', '#B45309', '#F59E0B', '#475569'];
      case 'logistics':
        return isDark 
          ? ['#6366F1', '#4F46E5', '#A5B4FC', '#38BDF8']
          : ['#4F46E5', '#3730A3', '#6366F1', '#2563EB'];
      case 'lawfirm':
        return isDark 
          ? ['#BE123C', '#881337', '#EAB308', '#FDA4AF']
          : ['#9F1239', '#BE123C', '#B45309', '#E11D48'];
      default:
        return isDark 
          ? ['#6AE7F7', '#2E9BF8', '#1554E8', '#8671F9']
          : ['#1554E8', '#0284C7', '#10B981', '#6366F1'];
    }
  };

  return {
    organizationId: orgId,
    organizationName: currentOrg.name,
    theme: isDark ? 'dark' : 'light',
    isDark,
    primaryColor: currentOrg.themeColor,
    secondaryColor: currentOrg.secondaryColor,
    accentColor: currentOrg.accentColor,
    themeColors: {
      primary: currentOrg.themeColor,
      secondary: currentOrg.secondaryColor,
      accent: currentOrg.accentColor
    },
    chartPalette: getChartPalette(),
    gridStroke: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)',
    tooltipStyle: {
      backgroundColor: isDark ? 'rgba(7, 17, 46, 0.96)' : 'rgba(255, 255, 255, 0.98)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
      color: isDark ? '#F6FDFF' : '#0F172A',
      borderRadius: '12px',
      boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.1)'
    },
    cardBg: isDark ? 'rgba(13, 35, 77, 0.65)' : '#FFFFFF',
    borderStroke: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
    textPrimary: isDark ? '#F6FDFF' : '#0F172A',
    textSecondary: isDark ? 'rgba(246, 253, 255, 0.75)' : '#475569'
  };
};

export default useOrganizationTheme;
