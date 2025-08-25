// components/BankPremiumRedeem/BankPremiumRedeem.Styles.ts
import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: #333;
  font-weight: 600;
`;

export const PremiumCount = styled.span`
  color: #666;
  font-size: 14px;
  margin-left: 10px;
`;

export const SearchInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  padding: 3px 5px;
  font-size: 11px;

  &:focus {
    border-color: #1a8797;
    box-shadow: 0 0 0 2px rgba(26, 135, 151, 0.2);
  }
`;

export const VerificationSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`;

export const CodeInput = styled.input<{ disabled?: boolean }>`
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  text-transform: uppercase;
  padding: 3px 5px;
  font-size: 11px;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "#fff")};

  &:focus {
    border-color: #1a8797;
    box-shadow: 0 0 0 2px rgba(26, 135, 151, 0.2);
  }
`;

export const VerifyButton = styled.button<{ disabled?: boolean }>`
  background: ${(props) => (props.disabled ? "#6c757d" : "#1a8797")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  padding: 4px 8px;
  font-size: 11px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #147581;
  }
`;

export const StatusMessage = styled.div<{ success: boolean }>`
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  background: ${(props) => (props.success ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.success ? "#155724" : "#721c24")};
  border: 1px solid ${(props) => (props.success ? "#c3e6cb" : "#f5c6cb")};
  font-size: 12px;
`;
